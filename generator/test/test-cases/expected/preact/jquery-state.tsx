import * as Preact from "preact";
import registerComponent from "../../../../../component_declaration/jquery_component_registrator";
import Component from "../../../../../component_declaration/jquery_base_component"
import WidgetComponent from "../../../../jquery-state.p"

export default class Widget extends Component {
  getProps(props:any) {
    props.state1Change = this._stateChange('state1');
    props.state2Change = this._stateChange('state2');

    return props;
  }

  get _viewComponent() {
      return WidgetComponent;
  }
}

registerComponent('Widget', Widget);