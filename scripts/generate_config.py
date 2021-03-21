import boto3
import os

def get_parameter(key, decrypt=False):
    client = boto3.client('ssm', region_name='ap-southeast-1')
    resp = client.get_parameter(Name=key, WithDecryption=decrypt)
    return resp

def write_application_config(fp):
    prefix = '{}_{}_{}'.format(
        'anxone',
        os.environ['ENVIRONMENT'],
        os.environ['SERVICE']      
    )
    key = '{}_passphrase'.format(prefix)
    param = get_parameter(key, True)
    passphrase = param['Parameter']['Value']
    print(passphrase)

    key = '{}_private_key'.format(prefix)
    param = get_parameter(key, True)
    privateKey = param['Parameter']['Value']
    print(privateKey)

    key = '{}_public_key'.format(prefix)
    param = get_parameter(key, True)
    publicKey = param['Parameter']['Value']
    print(publicKey)

    key = '{}_sms_api_key'.format(prefix)
    param = get_parameter(key, True)
    smsApiKey = param['Parameter']['Value']
    print(smsApiKey)

    key = '{}_sms_api_secret'.format(prefix)
    param = get_parameter(key, True)
    smsApiSecret = param['Parameter']['Value']
    print(smsApiSecret)

    key = '{}_local_sms_api_key'.format(prefix)
    param = get_parameter(key, True)
    localSmsApiKey = param['Parameter']['Value']
    print(localSmsApiKey)

    key = '{}_exchange_base_url'.format(prefix)
    param = get_parameter(key)
    exchangeBaseUrl = param['Parameter']['Value']
    print(exchangeBaseUrl)

    key = '{}_exchange_endpoints_login'.format(prefix)
    param = get_parameter(key)
    exchangeLoginEndPoint = param['Parameter']['Value']
    print(exchangeLoginEndPoint)

    key = '{}_anxone_base_url'.format(prefix)
    param = get_parameter(key)
    anxoneBaseUrl = param['Parameter']['Value']
    print(anxoneBaseUrl)

    key = '{}_anxone_endpoints_login'.format(prefix)
    param = get_parameter(key)
    anxoneLoginEndpoint = param['Parameter']['Value']
    print(anxoneLoginEndpoint)

    key = '{}_jwt_secret'.format(prefix)
    param = get_parameter(key)
    jwtSecret = param['Parameter']['Value']
    print(jwtSecret)

    key = '{}_premyo_base_url'.format(prefix)
    param = get_parameter(key)
    premyoBaseUrl = param['Parameter']['Value']
    print(premyoBaseUrl)

    key = '{}_bonds_notification_base_url'.format(prefix)
    param = get_parameter(key)
    notificationBaseUrl = param['Parameter']['Value']
    print(notificationBaseUrl)

    key = '{}_redir_bonds_base_url'.format(prefix)
    param = get_parameter(key)
    redirBondsBaseUrl = param['Parameter']['Value']
    print(redirBondsBaseUrl)

    with open("templates/application.tmpl", "r") as tmpl:
        template = tmpl.read()
        conf = template.format(
            passphrase=passphrase,
            privateKey=privateKey,
            publicKey=publicKey,
            exchangeBaseUrl=exchangeBaseUrl,
            exchangeLoginEndPoint=exchangeLoginEndPoint,
            anxoneBaseUrl=anxoneBaseUrl,
            anxoneLoginEndpoint=anxoneLoginEndpoint,
            jwtSecret=jwtSecret,
            smsApiKey=smsApiKey,
            smsApiSecret=smsApiSecret,
            premyoBaseUrl=premyoBaseUrl,
            notificationBaseUrl=notificationBaseUrl,
            redirBondsBaseUrl=redirBondsBaseUrl,
            localSmsApiKey=localSmsApiKey,
        )
        fp.write(conf)


def write_database_config(fp):
    prefix = '{}_{}_{}'.format(
        'anxone',
        os.environ['ENVIRONMENT'],
        os.environ['SERVICE']      
    )
    key = '{}_db_user'.format(prefix)
    param = get_parameter(key)
    username = param['Parameter']['Value']
    print(username)

    key = '{}_db_password'.format(prefix)
    param = get_parameter(key, True)
    password = param['Parameter']['Value']
    print(password)

    key = '{}_{}_db_port'.format(
        'anxone',
        os.environ['ENVIRONMENT']
    )
    param = get_parameter(key, True)
    port = param['Parameter']['Value']
    print(port) 

    key = '{}_db_name'.format(prefix)
    param = get_parameter(key)
    database = param['Parameter']['Value']
    print(database) 

    key = '{}_{}_db_endpoint'.format(
        'anxone',
        os.environ['ENVIRONMENT']
    )
    param = get_parameter(key, True)
    host = param['Parameter']['Value']
    print(host) 

    with open("templates/database.tmpl", "r") as tmpl:
        template = tmpl.read()
        conf = template.format(
            username=username,
            port=port,
            database=database,
            password=password,
            host=host
        )
        fp.write(conf)


def main():
    target_file = '../config/{}.js'.format(
        os.environ['ENVIRONMENT']
    )
    with open(target_file, 'w') as fp:
        fp.write("module.exports = {\n")
        write_database_config(fp)
        write_application_config(fp)
        fp.write("}\n")

if __name__ == "__main__":
    main()
