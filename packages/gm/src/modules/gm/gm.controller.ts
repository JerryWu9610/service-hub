import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';
import { BusinessException } from '@/exception';
import { ExcludeInterceptor } from '@/response';
import { HandleImgDto } from './dto/handle-img.dto';
import { GmService } from './gm.service';

@Controller('gm')
export class GmController {
  constructor(
    private readonly gmService: GmService,
    private readonly i18n: I18nService,
  ) {}

  @ExcludeInterceptor()
  @Post('/handle_img')
  async handleImg(
    @Body() body: HandleImgDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const handledImg = await this.gmService.handleImg({
        data: body.data,
        type: body.type,
        commands: body.commands,
      });
      res.type(body.type);
      res.send(handledImg);
    } catch (err) {
      throw new BusinessException({
        message: this.i18n.t('exception.handle_img_failed_message'),
        errorCode: 'HANDLE_IMG_FAILED',
      });
    }
  }
}
