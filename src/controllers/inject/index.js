import deltaToPlaintext from '../../lib/deltaToText/deltaToText';
import client from '../../database/db';
import AppError from '../../utils/appError';

export const injectCtrl = async (req, res, next) => {
  const { ws_id, note_id, txt_ops, ctime, utime } = req.body;

  const elsIndex = 'document';

  let plainText = '';
  let elsResponse = {};

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
  //ws_id, note_id, txt_ops Type 검사
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
  try {
    plainText = await deltaToPlaintext({ ops: txt_ops });
  } catch (error) {
    return next(
      new AppError(
        400,
        'SE02',
        'Invalid txt_ops value (부적절한 txt_ops 값입니다.)',
      ),
      req,
      res,
      next,
    );
  }

  //Elasticsearch Inject
  try {
    elsResponse = await client.index({
      index: elsIndex,
      id: ws_id + note_id, // PK
      body: {
        ws_id: ws_id,
        note_id: note_id,
        text: plainText,
        ctime: ctime,
        utime: utime,
      },
    });
  } catch (error) {
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
