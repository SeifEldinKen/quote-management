import { Router, Request, Response, NextFunction } from 'express';
import { IsAuthenticatedMiddleware } from 'applications/middlewares';
import { IBaseController } from '@shared/interfaces';
import httpStatus from 'http-status';
import ms from 'ms';
import {
  ChangePasswordUseCase,
  LoginWithEmailAndPasswordUseCase,
  LogoutUseCase,
  RefreshTokenUseCase,
} from '@domain/use-cases/auth';

export default class AuthController implements IBaseController {
  path: string;
  router: Router;

  constructor(
    private loginWithEmailAndPasswordUseCase = new LoginWithEmailAndPasswordUseCase(),
    private logoutUseCase = new LogoutUseCase(),
    private refreshTokenUseCase = new RefreshTokenUseCase(),
    private changePasswordUseCase = new ChangePasswordUseCase(),
  ) {
    this.path = '/auth';
    this.router = Router();

    this.initRoutes();
  }

  initRoutes(): void {
    /* POST */
    this.router.post(`${this.path}/login`, [
      /* Set middlewares here */
      this.login,
    ]);

    this.router.post(`${this.path}/logout`, [
      /* Set middlewares here */
      new IsAuthenticatedMiddleware().handler(),
      this.logout,
    ]);

    /* PUT */
    this.router.put(`${this.path}/refresh-token`, [
      /* Set middlewares here */
      this.refreshToken,
    ]);

    this.router.put(`${this.path}/change-password`, [
      /* Set middlewares here */
      new IsAuthenticatedMiddleware().handler(),
      this.changePassword,
    ]);

    this.router.put(`${this.path}/forgot-password`, this.forgotPassword);

    this.router.put(`${this.path}/reset-password`, this.resetPassword);
  }

  private login = async ({ body, headers }: Request, res: Response, next: NextFunction) => {
    try {
      // --> get data from request
      const { email, password } = body;

      // --> get user agent and ip from request
      const userAgent = headers['user-agent']!;

      // --> call login with email and password use-case
      const { user, tokens } = await this.loginWithEmailAndPasswordUseCase.execute({
        userAgent,
        email,
        password,
      });

      // --> store refresh token in cookie
      res.cookie('refreshToken', tokens.refresh, {
        httpOnly: true, // --> only accessible from server
        secure: process.env.NODE_ENV === 'production', // --> only accessible over https
        sameSite: 'none',
        maxAge: ms(process.env.REFRESH_TOKEN_EXPIRES_IN),
      });

      // --> send response to client
      res.status(httpStatus.OK).json({
        user,
        accessToken: tokens.access,
      });
    } catch (error) {
      next(error);
    }
  };

  private logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // --> get refresh token from cookies
      const refreshToken = req.cookies.refreshToken;

      // --> call logout use-case
      await this.logoutUseCase.execute({
        refreshToken,
        accessToken: req.headers.authorization?.split('Bearer ')[1]!,
        currentUser: req.user?.id!,
      });

      // --> delete refresh token from cookies
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
      });

      // --> send response to client
      res.status(httpStatus.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  };

  private refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // --> get refresh token from cookies
      const refreshToken = req.cookies.refreshToken;

      // --> call refresh token use-case
      const { newAccessToken, newRefreshToken } = await this.refreshTokenUseCase.execute({
        accessToken: req.headers.authorization?.split('Bearer ')[1]!,
        refreshToken,
      });

      // --> delete old refresh token from cookies
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
      });

      // --> store new refresh token in cookie
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: ms(process.env.REFRESH_TOKEN_EXPIRES_IN),
      });

      // --> send response to client
      res.status(httpStatus.CREATED).json({
        newAccessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  private changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // --> get data from request
      const { oldPassword, newPassword } = req.body;

      // --> call change password use-case
      await this.changePasswordUseCase.execute({
        currentUserId: req.user?.id!,
        oldPassword,
        newPassword,
      });

      // --> send response to client
      res.status(httpStatus.OK).json({
        message: 'password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  private forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //
    } catch (error) {
      next(error);
    }
  };

  private resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //
    } catch (error) {
      next(error);
    }
  };
}
