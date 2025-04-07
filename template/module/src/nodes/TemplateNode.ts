import * as Noodl from '@noodl/noodl-sdk';
import { MODULE_NAMESPACE } from '../constants';

export default Noodl.defineNode({
  name: `${MODULE_NAMESPACE}.templateNode`,
  displayName: 'Template',
  initialize() {

  },
  inputs: {

  },
  outputs: {

  },
  changed: {

  },
  signals: {

  },
  methods: {

  },
  setup(context, graphModel) {
    if (!context.editorConnection || !context.editorConnection.isRunningLocally())
      return;

    function _managePortsForNode(node: any) {
      function updatePorts(node: any, editorConnection: any, graphModel: any) {
        const ports: any[] = [];

        context.editorConnection.sendDynamicPorts(node.id, ports);
      }

      updatePorts(node, context.editorConnection, graphModel);

      node.on('parameterUpdated', (event: { name: string, value: any; state: any }) => {
        updatePorts(node, context.editorConnection, graphModel);
      });
    }

    graphModel.on('editorImportComplete', () => {
      graphModel.on(`nodeAdded.${this.node.name}`, (node: any) => {
        _managePortsForNode(node);
      });

      for (const node of graphModel.getNodesWithType(this.node.name))
        _managePortsForNode(node);
    });
  },
  getInspectInfo() {
    return '';
  }
});
