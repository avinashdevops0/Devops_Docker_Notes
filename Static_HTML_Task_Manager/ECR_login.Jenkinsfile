pipeline {
    agent any
    environment {
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = '172172674040'
        ECR_REPO = 'task_manager'
    }
    stages {
        stage ("Clean Workspace") {
            steps {
                cleanWs()
            }
        }
        stage ("Code") {
            steps {
                git branch: 'images',
                url: 'https://github.com/avinashdevops0/Devops_Docker_Notes.git'
            }
        }
        stage ("Build") {
            steps{
                dir ("Static_HTML_Task_Manager") {
                sh "docker build --no-cache -t ${ECR_REPO} ."
                sh "docker tag ${ECR_REPO}:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:latest"
                }
            }
        }
        stage('ECR Login and Pusing') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'AWS-ECR-registry', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                        sh """
                            aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                        """
                        sh "docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}:latest"
                }
            }
        }
        stage ("Running Containers") {
            steps {
                sh "docker network create fe-net || true && docker rm -f fe || true "
                sh "docker run -d --network fe-net --name fe -p 80:80 ${ECR_REPO}:latest"
            }
        }
    }
}
