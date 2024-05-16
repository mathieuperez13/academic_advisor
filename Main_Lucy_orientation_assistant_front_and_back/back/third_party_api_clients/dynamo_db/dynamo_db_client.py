'''



import boto3
import os

class DynamoDBClient:
    """
    A singleton class representing DynamoDB third-party API client.

    This class is designed to provide a single instance of the DynamoDB's API client
    to avoid unnecessary reinitialization.

    Example:
        Usage of the DynamoDBClient:

        ```python
        api_client = DynamoDBClient()
        ```
    """
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(DynamoDBClient, cls).__new__(cls)
            cls.client = boto3.resource(
                'dynamodb',
                aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                #region_name="us-east-1"
                region_name="ap-southeast-2"
            )
            

        return cls._instance
'''

import boto3
import os

class DynamoDBClient:
    """
    A singleton class representing DynamoDB third-party API client.

    This class is designed to provide a single instance of the DynamoDB's API client
    to avoid unnecessary reinitialization.

    Example:
        Usage of the DynamoDBClient:

        ```python
        api_client = DynamoDBClient()
        ```
    """
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            print("Creating new instance of DynamoDBClient")
            try:
                cls._instance = super(DynamoDBClient, cls).__new__(cls)
                cls.client = boto3.resource(
                    'dynamodb',
                    #aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
                    aws_access_key_id = 'AKIAXIRAVZD6MHXZFMVV',
                    aws_secret_access_key = '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',
                    #aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
                    #region_name="ap-southeast-2"
                    region_name ="us-east-1"
                )
                print("DynamoDBClient initialized successfully")
            except Exception as e:
                print(f"Failed to initialize DynamoDBClient: {e}")
        else:
            print("Using existing instance of DynamoDBClient")
        
        return cls._instance



    