import express from 'express'
import { GetSpecificUser, GetUserList } from '../controllers/User'
import { AuthUser } from '../middlewares/Auth'

const router = express.Router()

router.get('/', AuthUser(false), GetUserList)

router.get('/:id', AuthUser(false), GetSpecificUser)

export = router