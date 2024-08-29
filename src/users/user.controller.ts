import { Controller, Get, Body, Param, Put, Delete, UseGuards, Res } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth';
import { UserService } from 'src/users/user.service';
import { User } from './user.schema';
import { Response } from 'express';



@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Res() res: Response) {
   const users = await this.userService.findAll();

    res.status(200).json({
      message: 'All users retrieved successfully',
      users,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const user = await this.userService.findOne(id);

    res.status(200).json({
      message: 'User details retrieved succesfully',
      user,
    });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: Partial<User>, @Res() res: Response) {
    const updatedUser = this.userService.update(id, updateUserDto);

    res.status(200).json({
      message: 'User details updated succesfully',
      updatedUser,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    this.userService.remove(id);

    res.status(200).json({
      message: 'User deleted succesfully',
    });
  }
}