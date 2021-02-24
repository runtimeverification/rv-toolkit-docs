pipeline {
  agent {
    dockerfile {
      label 'docker && !smol'
      additionalBuildArgs '--build-arg K_COMMIT="$(cd deps/k && git rev-parse --short=7 HEAD)" --build-arg USER_ID=$(id -u) --build-arg GROUP_ID=$(id -g)'
    }
  }
  environment {
    GITHUB_TOKEN = credentials('rv-jenkins')
    LONG_REV     = """${sh(returnStdout: true, script: 'git rev-parse HEAD').trim()}"""
  }
  options { ansiColor('xterm') }
  stages {
    stage('Init title') {
      when { changeRequest() }
      steps { script { currentBuild.displayName = "PR ${env.CHANGE_ID}: ${env.CHANGE_TITLE}" } }
    }
    stage('GitHub Pages') {
      when {
        branch 'master'
        beforeAgent true
      }
      steps {
        sshagent(['2b3d8d6b-0855-4b59-864a-6b3ddf9c9d1a']) {
          sh '''
            git clone 'ssh://github.com/runtimeverification/rv-toolkit-docs.git'
            cd rv-toolkit-docs
            git checkout -B gh-pages origin/master
            git submodule update --init --recursive -- ./web
            cd web
            npm install
            npm run build
            npm run build-sitemap
            cd -
            mv web/public_content ./
            rm -rf $(find . -maxdepth 1 -not -name public_content -a -not -name .git -a -not -path . -a -not -path .. -a -not -name CNAME)
            mv public_content/* ./
            rm -rf public_content
            git add ./
            git commit -m 'gh-pages: Updated the website'
            git merge --strategy ours origin/gh-pages --allow-unrelated-histories
            git push origin gh-pages
          '''
        }
      }
    }
  }
}
