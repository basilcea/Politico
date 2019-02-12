import jwt from 'jsonwebtoken';
import pool from '../migrate';
import 'dotenv';

const auth = {
  // eslint-disable-next-line consistent-return
  async checkToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({
        status: 401,
        error: 'You need to Login',
      });
    }
    try {
      const decrypt = await jwt.verify(token, process.env.SECRET);
      const getUser = 'SELECT * FROM users WHERE id= $1';
      const { rows } = await pool.query(getUser, [decrypt.id]);
      if (!rows[0]) {
        return res.status(403).json({
          status: 403,
          error: ' Token Not accessible',
        });
      }
      req.user = {
        id: decrypt.id,
        isAdmin: decrypt.isAdmin,
      };
      next();
    } catch (error) {
      return res.status(501).json({
        status: 501,
        error: error.toString(),
      });
    }
  },
};
export default auth;
