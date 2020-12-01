import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';

// imported constructs
// import { KubeDeployment, KubeService, IntOrString } from './imports/k8s';

// cdk8s+
import * as kplus from 'cdk8s-plus-17';


export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    // const label = { app: 'hello-k8s' };

    const deploy = new kplus.Deployment(this, 'Deployment', {
      replicas: 3,
      containers: [{
        image: 'pahud/flask-docker-sample:latest',
        env: {
          'PLATFORM': {
            value: 'CDK8S+',
          }
        }
      }],
    });

    deploy.expose(80, {
      serviceType: kplus.ServiceType.LOAD_BALANCER, 
      targetPort: 80,
    })

    // new KubeService(this, 'service', {
    //   spec: {
    //     type: 'LoadBalancer',
    //     ports: [ { port: 80, targetPort: IntOrString.fromNumber(80) } ],
    //     selector: label
    //   }
    // });

    // new KubeDeployment(this, 'deployment', {
    //   spec: {
    //     replicas: 3,
    //     selector: {
    //       matchLabels: label
    //     },
    //     template: {
    //       metadata: { labels: label },
    //       spec: {
    //         containers: [
    //           {
    //             name: 'flask-service',
    //             image: 'pahud/flask-docker-sample:latest',
    //             ports: [ { containerPort: 80 } ],
    //             env: [
    //               {
    //                 name: 'PLATFORM',
    //                 value: 'Amazon EKS(cdk8s+argocd)'
    //               }
    //             ]
    //           }
    //         ]
    //       }
    //     }
    //   }
    // });
  }
}

const app = new App();
new MyChart(app, 'hello');
app.synth();
