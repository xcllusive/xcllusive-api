import aws from 'aws-sdk'

export const uploadToS3 = (bucketName, file, fileName) => {
  /* eslint-disable no-new */
  const s3bucket = new aws.S3({ params: { Bucket: bucketName } })
  return new Promise((resolve, reject) => {
    s3bucket.createBucket(() => {
      const params = {
        Bucket: bucketName,
        ACL: 'public-read',
        Key: fileName,
        Body: file.data,
        ContentType: 'application/octet-stream'
      }

      s3bucket.upload(params, (err, data) => {
        if (err) {
          console.log('error in callback: ', err)
          reject(err)
        }
        console.log('success: ', data)
        resolve(data)
      })
    })
  })
}
