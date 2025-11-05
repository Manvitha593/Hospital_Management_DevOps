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
                    dockerImage = docker.build("hospital-management-app")
                }
            }
        }

        stage('Clean Old Containers') {
            steps {
                script {
                    bat '''
                    docker ps -q --filter "name=hospital-management-app" | findstr . && docker stop hospital-management-app || echo "No running container"
                    docker ps -aq --filter "name=hospital-management-app" | findstr . && docker rm hospital-management-app || echo "No container to remove"
                    '''
                }
            }
        }

        stage('Run Container') {
            steps {
                script {
                    // Start new container with the same name
                    bat 'docker run -d --name hospital-management-app -p 8081:3000 hospital-management-app'
                }
            }
        }

        stage('List Containers') {
            steps {
                script {
                    bat 'docker ps -a'
                }
            }
        }
    }
}
