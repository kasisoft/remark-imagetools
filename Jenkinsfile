pipeline {
    agent any
    tools {
        nodejs 'node-18.18.2'
    }
    // environment {
    // }
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
        // stage('Build') {
        //    steps {
        //    }
        // }
        // stage('Testing') {
        //    steps {
        //    }
        // }
        // stage('SonarQube Analysis') {
        //     steps {
                // properties such as sonar.host.url and sonar.login are configured in the m2 settings.xml for this profile
                // sh 'mvn clean verify -Psonar -Dsonar.projectKey=kcl'
        //     }
        // }
    }
}

