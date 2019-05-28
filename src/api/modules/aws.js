import aws from 'aws-sdk'
import awsSNS from '../../config/vars'

export const uploadToS3 = (bucketName, file, fileName) => {
  /* eslint-disable no-new */
  const s3bucket = new aws.S3({
    params: {
      Bucket: bucketName
    }
  })
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
          reject(err)
        }
        resolve(data)
      })
    })
  })
}

export const SNS = (buyer, phone, message) => {
  var sns = new aws.SNS()

  sns.subscribe({
    Protocol: 'sms',
    TopicArn: 'arn:aws:sns:ap-southeast-2:264038389685:MyTopic',
    Endpoint: phone // type mobile number to whom you want to send a message.
  }, function (error, data) {
    if (error) {
      console.log('error when subscribe', error)
    }
    // console.log('subscribe data', data)
    var SubscriptionArn = data.SubscriptionArn
    var params = {
      TargetArn: 'arn:aws:sns:ap-southeast-2:264038389685:MyTopic',
      Message: message, // type your message
      Subject: 'Xcllusive Business Sales' // type your subject
    }

    // publish a message.
    sns.publish(params, function (err, data) {
      if (err) {
        console.log('Error sending a message', err)
      } else {
        // console.log('Sent message:', data.MessageId)
      }
      var params = {
        SubscriptionArn: SubscriptionArn
      }

      // unsubscribing the topic
      sns.unsubscribe(params, function (err, data) {
        if (err) {
          console.log('err when unsubscribe', err)
        }
      })
    })
  })
}
