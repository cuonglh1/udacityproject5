import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { AttachmentUtils } from '../../filesStorage/attachmentUtils'
import { getUserId } from '../utils';
import { updateAttachmentUrl } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger'

const attUtils = new AttachmentUtils()
const logger = createLogger('deleteLambdaFunction')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)

    // Delete the attachment
    const todoId = event.pathParameters.attachmentId
    logger.info("todoId got: " + todoId)
    logger.info("Deleting attachment: " + todoId)
    await attUtils.deleteAttachment(todoId)
    
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    await updateAttachmentUrl(todoId, userId, '')
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify("Deleted Success")
    }
}
)

handler.use(
    cors({
        credentials: true
    })
)