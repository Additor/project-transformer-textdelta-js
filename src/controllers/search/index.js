import AppError from '../../utils/appError';
import client from '../../database/db';

const createDoc = docs => {
  //elasticsearch에서 검색한 결과를 바탕으로 필요한 정보만 추출하여 새로운 object로 만들기

  const docCount = docs.length;
  let result = [];

  for (let i = 0; i < docCount; i++) {
    result.push({
      ws_id: docs[i]['_source']['ws_id'],
      note_id: docs[i]['_source']['note_id'],
      text: docs[i]['_source']['text'],
    });
  }
  return result;
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

  //ws_id, q, page Type 검사
  if (page < 1) {
    return next(
      new AppError(400, 'SE02', 'Invalid page value (부적절한 page 값입니다.)'),
      req,
      res,
      next,
    );
  } else {
    page = page - 1;
  }

  //Elasticsearch Total Count
  //Work space에서 검색어와 일치하는 Documents 총 갯수
  //Pagenation 작업을 하기 위해서 필요
  try {
    elsResponse = await client.count({
      index: 'document',
      body: {
        query: {
          bool: {
            must: {
              match: {
                text: q,
              },
            },
            filter: {
              term: {
                ws_id: ws_id,
              },
            },
          },
        },
      },
    });
    totalCount = elsResponse['count'];
  } catch (error) {
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

  //elasticsearch 검색 (검색하는 쿼리 분리 필요)
  try {
    elsResponse = await client.search({
      index: 'document',
      from: page,
      size: size,
      body: {
        query: {
          bool: {
            must: {
              match: {
                text: q,
              },
            },
            filter: {
              term: {
                ws_id: ws_id,
              },
            },
          },
        },
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

  docs = createDoc(elsResponse['hits']['hits']);

  res.status(200).json({
    total_page: totalPage,
    total_doc: totalCount,
    docs: docs,
  });
};
