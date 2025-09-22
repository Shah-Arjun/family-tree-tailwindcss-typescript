import express from 'express'
import userController, { getUser } from '../controllers/userController'
import verifyToken from '../middleware/auth'

const router = express.Router()

//GET logged in user detatils---> /api/user/me
router.get("/me", verifyToken, getUser)