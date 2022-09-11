import { Body, Controller, Get, HttpException, Param, Put, Query, Req, Res, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer/class-serializer.interceptor';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ResponseMessage } from 'src/core/interface';
import { User } from 'src/core/models';
import { serialize } from 'src/core/utils/interceptor/serialize.interceptor';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { constant } from '../core';
import { QueryJoiValidatorPipe } from '../core/pipe/queryValidator.pipe';
import { JoiValidatorPipe } from '../core/pipe/validator.pipe';
import { ChangePasswordDTO, FilterUsersDTO, UpdateUserDTO, vChangePasswordDTO, vFilterUsersDto, vUpdateUserDTO } from './dto';
import { UserService } from './user.service';

@ApiTags('User')
@ApiBearerAuth()
@Controller(UserController.endPoint)
export class UserController {
    static endPoint = '/api/user';

    constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

    @Get('/me')
    @UseGuards(AuthGuard)
    @serialize(User)
    async cGetMe(@Req() req: Request, @Res() res: Response) {
        console.log('Hello');
        return res.send(req.user);
    }

    @Put('/password')
    @UseGuards(AuthGuard)
    @UsePipes(new JoiValidatorPipe(vChangePasswordDTO))
    async changePassword(@Body() body: ChangePasswordDTO, @Res() res: Response, @Req() req: Request) {
        //get current user data
        const user = await this.userService.findOne('id', req.user.id);
        //check current input value is correct or not
        const isCorrectPassword = await this.authService.decryptPassword(body.currentPassword, user.password);
        if (!isCorrectPassword) {
            throw new HttpException({ errorMessage: ResponseMessage.INVALID_PASSWORD }, StatusCodes.BAD_REQUEST);
        }
        //change password to new password
        user.password = await this.authService.encryptPassword(body.newPassword, constant.default.hashingSalt);
        await this.userService.updateOne(user);
        return res.send();
    }

    @Put('/')
    @UseGuards(AuthGuard)
    @UsePipes(new JoiValidatorPipe(vUpdateUserDTO))
    async updateUserInformation(@Body() body: UpdateUserDTO, @Res() res: Response, @Req() req: Request) {
        //get current user data
        const user = await this.userService.findOne('id', req.user.id);
        // update field
        user.name = body.name;
        console.log(body);
        user.phone = body.phone;
        await this.userService.updateOne(user);
        return res.send();
    }

    @Get('/')
    @UsePipes(new QueryJoiValidatorPipe(vFilterUsersDto))
    async filterUsers(@Query() queries: FilterUsersDTO, @Res() res: Response) {
        const result = await this.userService.findMany(queries);

        return res.send(result);
    }
}
