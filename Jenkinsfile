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

        stage('Run Container') {
            steps {
                script {
                    dockerImage.run('-d -p 8081:3000')
                }
            }
        }

        stage('Clean Up') {
            steps {
                script {
                    sh 'docker ps -a'
                }
            }
        }
    }
}
