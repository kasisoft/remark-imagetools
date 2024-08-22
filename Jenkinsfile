pipeline {
    agent any
    tools {
        nodejs 'node-18.18.2'
    }
    environment {
        SONAR_KEY = credentials('sonar-key')
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
                // properties such as sonar.host.url and sonar.login are configured in the m2 settings.xml for this profile
                // sh 'mvn clean verify -Psonar -Dsonar.projectKey=kcl'
                sh './node_modules/sonar-scanner/bin/sonar-scanner -Dsonar.projectKey=remark-imagetools -Dsonar.host.url=https://arturius.kasisoft.com/sonar'
            }
        }
    }
}

