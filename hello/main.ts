import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';

// imported constructs
// import { KubeDeployment, KubeService, IntOrString } from './imports/k8s';

// cdk8s+
import * as kplus from 'cdk8s-plus-17';

export interface ContainerEnvVar {
  [name: string]: kplus.EnvValue;
}

export interface MicroServiceProps {
  readonly image: string;
  /**
   * service port
   * @default - 80
   */
  readonly servicePort?: number;
  /**
   * container port
   * @default - 80
   */
  readonly containerPort?: number;
  /**
   * number of replicas
   * @default 2
   */
  readonly replica?: number;
  /**
   * env var for the container
   */
  readonly env?: ContainerEnvVar;
  /**
   * service type
   * @default LOAD_BALANCER
   */
  readonly serviceType?: kplus.ServiceType;
}

export class MicroService extends Construct {
  constructor(scope: Construct, id: string, props: MicroServiceProps) {
    super(scope, id)
    const deploy = new kplus.Deployment(this, 'Deployment', {
      replicas: props.replica ?? 2,
      containers: [{
        image: props.image,
        env: props.env,
      }],
    });

    deploy.expose(props.servicePort ?? 80, {
      serviceType: props.serviceType ?? kplus.ServiceType.LOAD_BALANCER, 
      targetPort: props.containerPort ?? 80,
    })
  }
}


export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    new MicroService(this, 'flask-service', {
      image: 'pahud/flask-docker-sample:latest',
      env: {
        'PLATFORM': { value: 'CDK8S+ Demo'}
      }
    });

    // const label = { app: 'hello-k8s' };

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
