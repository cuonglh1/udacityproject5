import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
import { createLogger } from '../utils/logger'
const logger = createLogger('helpers-attachmentUtils')

export class AttachmentUtils {
    bucketName: string
    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' })) {
    }

    getSignedUrl(todoId: string): string {
        const signedUrl = this.s3.getSignedUrl('putObject', {
            Bucket: process.env.ATTACHMENT_S3_BUCKET,
            Key: todoId,
            Expires: Number(process.env.SIGNED_URL_EXPIRATION)
        });

        logger.info(signedUrl);

        return signedUrl as string;
    }

    async deleteAttachment(attachmentId: string) {
        logger.info("attachmentId " + JSON.stringify(attachmentId))
        try{
             this.s3.deleteObject( {
                Bucket: process.env.ATTACHMENT_S3_BUCKET,
                Key: attachmentId
            }).promise()
        }
        catch(err){
            logger.error("Error occurs: " + err)
        }
    }

}