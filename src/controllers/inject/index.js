import deltaToPlaintext from '../../lib/deltaToText/deltaToText';
import { inject } from '../../database/db';
import AppError from '../../utils/appError';

export const injectCtrl = async (req, res, next) => {
  const { ws_id, note_id, txt_ops, ctime, utime } = req.body;
  const elsIndex = 'document';
  let plainText = '';

  //ws_id, note_id, txt_ops, ctime, utime Key 검사
  if (!ws_id || !note_id || !txt_ops || !ctime || !utime) {
    return next(
      new AppError(
        400,
        'SE01',
        'Incorrect query request (잘못된 쿼리요청입니다.)',
      ),
      req,
      res,
      next,
    );
  }

  //ws_id, note_id, txt_ops, ctime, utime Type 검사
  if (
    typeof ws_id != 'string' ||
    typeof note_id != 'string' ||
    typeof txt_ops != 'object' ||
    typeof ctime != 'number' ||
    typeof utime != 'number'
  ) {
    return next(
      new AppError(
        400,
        'SE01',
        'Incorrect query request (잘못된 쿼리요청입니다.)',
      ),
      req,
      res,
      next,
    );
  }

  //Plain Text로 변환
  plainText = await deltaToPlaintext({ ops: txt_ops }).catch(err => {
    console.log(err);
    throw next(
      new AppError(
        400,
        'SE02',
        'Invalid txt_ops value (부적절한 txt_ops 값입니다.)',
      ),
      req,
      res,
      next,
    );
  });

  //ElasticSearch Inject
  try {
    await inject({ elsIndex, ws_id, note_id, plainText, ctime, utime });
  } catch (err) {
    return next(
      new AppError(500, 'SE98', 'ElasticSearch Error (엘라스틱서치 에러)'),
      req,
      res,
      next,
    );
  }

  //성공, 컨텐츠 반환이 없기 때문에 204
  res.status(204).send({});
};
