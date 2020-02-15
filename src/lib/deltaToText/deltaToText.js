function deltaToText(deltaObject) {
  const replaceTrim = function(text) {
    //개행, 공백 치환
    text = text.replace(/\n+/g, ' ');
    text = text.replace(/\s+/g, ' ');

    return text;
  };

  return new Promise(function(resolve, reject) {
    //파라미터로 받은 object Type 검사
    if (typeof deltaObject != 'object') {
      reject(new TypeError('only `insert` keys can be transformed'));
    }
    //'ops' key가 있는지 확인
    if (!Array.isArray(deltaObject['ops'])) {
      reject(new TypeError('`ops` key have to array type'));
    }
    let plainText = deltaObject['ops'].reduce(function(accText, cur) {
      if ('insert' in cur && typeof cur['insert'] === 'string') {
        //Text Parser
        let curText = replaceTrim(cur['insert']);

        return accText + curText;
      } else if ('attributes' in cur) {
        //Image Caption Parser
        if ('data' in cur['attributes']) {
          let plainCaption = cur['attributes']['data'].reduce(function(
            accCaption,
            curCaption,
          ) {
            if ('attributes' in curCaption) {
              return accCaption + curCaption['attributes']['caption'] + ' ';
            } else {
              return accCaption;
            }
          },
          '');

          return accText + plainCaption + ' ';
        } else if ('caption' in cur['attributes']) {
          let plainCaption = replaceTrim(cur['attributes']['caption']);

          return accText + plainCaption + ' ';
        } else {
          return accText;
        }
      } else {
        return accText;
      }
    }, '');

    //연속되는 공백을 하나의 공백으로 치환
    plainText = plainText.replace(/ +/g, ' ');
    //양쪽 끝 여백 제거
    plainText = plainText.replace(/(^ *)|( *$)/g, '').replace(/ +/g, ' ');

    resolve(plainText);
  });
}

module.exports = deltaToText;
