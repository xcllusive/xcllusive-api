import express from 'express'

import {
  get,
  list,
  create,
  update,
  remove,
  listFolders,
  uploadFile,
  listFiles,
  removeFile
} from '../controllers/document.controller'

import {
  TOOLS_AND_DOCS_MENU
} from '../constants/roles'

import {
  authMiddleware,
  authorizeMiddleware
} from '../middlewares/auth'
import {
  controlActivityUser
} from '../middlewares/controlActivity'

const router = express.Router()

router.use(authMiddleware).use(
  authorizeMiddleware({
    roles: [TOOLS_AND_DOCS_MENU]
  })
)

router.use(controlActivityUser('ToolsAndDocs'))

router
  .route('/documentFolder')
  .post(create)
  .get(list)

router
  .route('/documentFolder/:documentFolderId')
  .get(get)
  .put(update)
  .delete(remove)

router
  .route('/listFolders/:officeId')
  .get(listFolders)

router.route('/upload-file').post(uploadFile)

router
  .route('/listFiles/:folderId')
  .get(listFiles)

router
  .route('/documentFile/:documentFileId')
  .delete(removeFile)

export default router
