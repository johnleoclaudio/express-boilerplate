interface IParams {
  statusCode: number;
  response: any;
}

const response = (params: IParams) => {
  const { statusCode, response } = params;

  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS,PATCH',
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    },
    statusCode,
    body: JSON.stringify(response),
  };
};

export default response;
