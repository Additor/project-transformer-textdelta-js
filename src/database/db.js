import elasticsearch from 'elasticsearch';

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace',
  apiVersion: '7.2', // use the same version of your Elasticsearch instance
});

const inject = async object => {
  const { elsIndex, ws_id, note_id, plainText, ctime, utime } = object;

  try {
    await client.index({
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
  } catch (err) {
    throw new Error(err);
  }
};

const search = async object => {
  const { page, size, q, ws_id } = object;

  try {
    const res = await client.search({
      index: 'document',
      from: page - 1,
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
    return res;
  } catch (err) {
    throw new Error(err);
  }
};

const count = async object => {
  const { q, ws_id } = object;

  try {
    const res = await client.count({
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

    return res;
  } catch (err) {
    throw new Error(err);
  }
};

export { inject, count, search };
