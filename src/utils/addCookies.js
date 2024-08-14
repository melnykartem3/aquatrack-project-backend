
export const addCookies = (res, session) => {
  const { _id, refreshToken } = session;
  res.cookie('sessionId', _id, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    expire: new Date(Date.now() ),
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    expire: new Date(Date.now() ),
  });
};
