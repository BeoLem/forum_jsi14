import express from 'express'

const router = express.Router()

// /**
//  * @route /blogs/
//  * @method post
//  * @access public
//  * @desc Create a blog
//  */
// router.post(
//     '/',
//     ValidateHeader([
//         {
//             name: 'authorization',
//             type: 'string',
//             required: true,
//         },
//     ]),
//     ValidateBody([
//         {
//             name: 'title',
//             type: 'string',
//             required: true,
//         },
//         {
//             name: 'description',
//             type: 'string',
//             required: true,
//         },
//         {
//             name: 'category',
//             type: 'string',
//             required: true,
//         },
//     ]),
//     AuthUser(true),
//     CreateBlog
// )

// /**
//  * @route /blogs/:id
//  * @method delete
//  * @access public
//  * @desc Delete a blog
//  */
// router.delete(
//     '/:id',
//     ValidateHeader([
//         {
//             name: 'authorization',
//             type: 'string',
//             required: true,
//         },
//     ]),
//     AuthUser(true),
//     DeleteBlog
// )

// /**
//  * @route /blogs/@list
//  * @method get
//  * @access public
//  * @desc Get blog list
//  */
// router.get('/@list', GetBlogList)

// /**
//  * @route /blogs/:id
//  * @method get
//  * @access public
//  * @desc Get a blog
//  */
// router.get('/:id', GetSpecificBlog)

export = router
