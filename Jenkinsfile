pipeline {
    agent any
    tools {
        nodejs 'node-18.18.2'
    }
    stages {
        stage('Initialize') {
            steps {
                sh 'echo "PATH = ${PATH}"'
            }
        }
        stage('Install pnpm') {
            steps {
                sh 'npm install -g pnpm'
            }
        }
        stage('Install packages') {
            steps {
                sh 'pnpm install'
            }
        }
        stage('Build') {
            steps {
                sh 'pnpm pack'
            }
        }
        stage('Testing') {
            steps {
                sh 'pnpm test'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh './node_modules/sonar-scanner/bin/sonar-scanner -Dsonar.projectKey=remark-imagetools -Dsonar.language=ts -Dsonar.sources=src'
                }
            }
        }
    }
}

