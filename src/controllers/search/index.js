import AppError from '../../utils/appError';
import { search, count } from '../../database/db';

const createDoc = docs => {
  //elasticsearch에서 검색한 결과를 바탕으로 필요한 정보만 추출하여 새로운 object로 만든다.
  return docs.map(doc => ({
    ws_id: doc['_source']['ws_id'],
    note_id: doc['_source']['note_id'],
    text: doc['_source']['text'],
  }));
};

export const searchCtrl = async (req, res, next) => {
  let { q, ws_id, page } = req.body;

  //init
  const size = 10;

  let elsResponse;
  let totalCount = 0; //Elasticsearch 검색된 도큐먼트 갯수
  let totalPage = 0;
  let docs = [];

  //key가 없으면 에러 출력
  if (!q || !ws_id) {
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

  //ws_id, q, page Type 검사
  if (
    typeof ws_id != 'string' ||
    typeof q != 'string' ||
    typeof page != 'number'
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

  if (page < 1) {
    return next(
      new AppError(400, 'SE02', 'Invalid page value (부적절한 page 값입니다.)'),
      req,
      res,
      next,
    );
  }

  //Elasticsearch Total Count
  try {
    elsResponse = await count({ ws_id, q });
    totalCount = elsResponse['count'];
  } catch (err) {
    return next(
      new AppError(500, 'SE98', 'ElasticSearch Error (엘라스틱서치 에러)'),
      req,
      res,
      next,
    );
  }

  //존재하는 페이지 수
  if (totalCount <= 0) {
    res.status(200).json({
      total_page: 0,
      total_doc: 0,
      docs: [],
    });
  } else {
    totalPage = Math.ceil(totalCount / size);
  }

  if (page > totalPage) {
    return next(
      new AppError(400, 'SE02', 'Invalid page value (부적절한 page 값입니다.)'),
      req,
      res,
      next,
    );
  }

  //elasticsearch 검색
  try {
    elsResponse = await search({ page, size, q, ws_id });
  } catch (err) {
    return next(
      new AppError(500, 'SE98', 'ElasticSearch Error (엘라스틱서치 에러)'),
      req,
      res,
      next,
    );
  }

  docs = createDoc(elsResponse['hits']['hits']);

  res.status(200).json({
    total_page: totalPage,
    total_doc: totalCount,
    docs: docs,
  });
};
