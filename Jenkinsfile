pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Manvitha593/Hospital_Management_DevOps.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    bat 'docker build -t hospital-management-app .'
                }
            }
        }

        stage('Clean Old Containers') {
            steps {
                script {
                    bat '''
                    docker ps -q --filter "name=hospital-management-app" | findstr . >nul && docker stop hospital-management-app || echo No running container
                    docker ps -aq --filter "name=hospital-management-app" | findstr . >nul && docker rm hospital-management-app || echo No container to remove
                    '''
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    bat 'docker run -d -p 8081:3000 --name hospital-management-app hospital-management-app'
                }
            }
        }

        stage('List Containers') {
            steps {
                bat 'docker ps -a'
            }
        }
    }
}
