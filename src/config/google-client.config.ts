import { ConfigService } from '@nestjs/config';
import { OAuth2Client, OAuth2ClientOptions } from 'google-auth-library';
import { Provider } from '@nestjs/common';

export const GoogleOAuthProvider: Provider = {
  provide: 'GOOGLE_OAUTH_CLIENT',
  useFactory: (configService: ConfigService) => {
    const oAuth2ClientOptions: OAuth2ClientOptions = {
      clientId: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      redirectUri: configService.get('GOOGLE_REDIRECT_URI'),
    };

    return new OAuth2Client(oAuth2ClientOptions);
  },
  inject: [ConfigService],
};
