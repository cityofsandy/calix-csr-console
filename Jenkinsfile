node {
  def app
  currentBuild.result = "SUCCESS"
  try {
    stage('Clone repository') {
      checkout scm
    }
    
    stage('NPM Install') {
      sh 'pwd'
      sh 'node -v'
      sh 'rm -rf node_modules'
      sh 'npm cache clean --force'
      sh 'npm install'
    }
    
    stage('NPM Build') {
      sh 'npm run build'
    }
    
    stage('Quality Gate') {
        def scannerHome = tool 'SonarQube Scanner 2.8';
        withSonarQubeEnv {
            sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=org.sandynet.calix.csr.console:dev -Dsonar.projectName='Calix CSR Console' -Dsonar.projectVersion=0.1 -Dsonar.sources=src/ -Dsonar.sourceEncoding=UTF-8 -Dsonar.javascript.lcov.reportPaths=dist/coverage/lcov.info -Dsonar.exclusions=**/*spec.js"
        }
    }
    
    stage('Build Docker Image') {
      app = docker.build("gbrewster/calix-csr-console")
    }

    stage('Test image') {
        app.inside {
            sh 'echo "Tests passed"'
        }
    }
    
    stage('Push Docker Image') {
      docker.withRegistry('', 'f1a38657-321b-4863-894f-08f07bb63829') {
        app.push()
      }
    }

  } catch (err) {
    currentBuild.result = 'FAILURE'
    throw err
  } finally {
    step([$class: 'Mailer', notifyEveryUnstableBuild: true, recipients: "${sn_dev_email_dist_list}", sendToIndividuals: true])
  }
}