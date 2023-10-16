import { AuthRepository } from "../database";
import {
  generatePassword,
  validatePassword,
  generateUsername,
  generateSalt,
  formatData,
  generateAccessToken,
  generateRefreshToken,
} from "../utils";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_SECRET } from "../config";

class AuthService {
  repository: AuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  async signUp(email: string, password: string) {
    const username = await generateUsername();
    const salt = await generateSalt();
    const hashedPassword = await generatePassword(password, salt);

    const id = await this.repository.createUser(
      email,
      hashedPassword,
      username,
      salt,
    );

    return formatData({ id, username });
  }

  async signInByEmail(email: string, password: string) {
    const existingUser = await this.repository.findUserByEmail(email);

    if (existingUser) {
      const validPassword = await validatePassword(
        password,
        existingUser.password,
        existingUser.salt,
      );
      if (validPassword) {
        const newRefreshToken = generateRefreshToken(existingUser.username);
        const accessToken = generateAccessToken(existingUser.username);

        await this.repository.createRefreshToken(
          existingUser.id,
          newRefreshToken,
        );

        return formatData({
          id: existingUser.id,
          accessToken,
          newRefreshToken,
        });
      }
    }

    return formatData(null);
  }

  async signInByUsername(username: string, password: string) {
    const existingUser = await this.repository.findUserByUsername(username);

    if (existingUser) {
      const validPassword = await validatePassword(
        password,
        existingUser.password,
        existingUser.salt,
      );
      if (validPassword) {
        const newRefreshToken = generateRefreshToken(existingUser.username);
        const accessToken = generateAccessToken(existingUser.username);

        await this.repository.createRefreshToken(
          existingUser.id,
          newRefreshToken,
        );

        return formatData({
          id: existingUser.id,
          accessToken,
          newRefreshToken,
        });
      }
    }

    return formatData(null);
  }

  async signOut(refreshToken: string) {
    await this.repository.deleteRefreshToken(refreshToken);
  }

  async refresh(refreshToken: string) {
    const existingUser =
      await this.repository.findUserByRefreshToken(refreshToken);

    //Reuse detection
    if (!existingUser) {
      try {
        const payload = jwt.verify(refreshToken, `${REFRESH_TOKEN_SECRET}`);

        const hackedUser = await this.repository.findUserByUsername(
          (payload as any).username,
        );
        await this.repository.deleteAllUserRefreshToken(hackedUser.id);
      } catch (err) {
        return 403;
      }
      return 403;
    }

    try {
      jwt.verify(refreshToken, `${REFRESH_TOKEN_SECRET}`);

      const accessToken = generateAccessToken(existingUser.username);
      const newRefreshToken = generateRefreshToken(existingUser.username);

      await this.repository.replaceRefreshToken(
        existingUser.id,
        refreshToken,
        newRefreshToken,
      );
      return { accessToken, newRefreshToken, existingUser };
    } catch (err) {
      await this.repository.deleteRefreshToken(refreshToken);
      return 403;
    }
  }

  async changePassword(id: number, newPassword: string) {
    const existingUser = await this.repository.findUserById(id);

    await this.repository.updatePassword(id, newPassword);
    await this.repository.deleteAllUserRefreshToken(id);

    const newRefreshToken = generateRefreshToken(existingUser.username);
    await this.repository.createRefreshToken(id, newRefreshToken);

    return newRefreshToken;
  }

  async changeUsername(id: number, newUsername: string) {
    await this.repository.updateUsername(id, newUsername);
  }

  async deleteAccount(id: number) {
    await this.repository.deleteUserById(id);
  }

  async subscribeEvents(payload: string) {
    const message = JSON.parse(payload);

    const { event, data } = message;

    const { id, username } = data;

    switch (event) {
      case "DELETE_ACCOUNT":
        await this.deleteAccount(id);
        break;
      case "CHANGE_USERNAME":
        await this.changeUsername(id, username);
        break;
      default:
        break;
    }
  }
}

export default AuthService;
