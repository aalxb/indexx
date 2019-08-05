import React from 'react'
import { PickerView } from 'antd-mobile';
import FilterFooter from '../../../components/FilterFooter'
// import Spring from 'react-spring'

export default class FilterPicker extends React.Component {
  state = {
    value: this.props.defaultValue
  }
  onChange = (val) => {
    this.setState({
      value: val
    });
    // console.log(val)
  }
  render() {
    const { onCancel, onSave, data, cols, type } = this.props
    const { value } = this.state
    return (
      <div>

        <PickerView onChange={this.onChange} data={data} cols={cols} value={value} />
        <FilterFooter onCancel={() => onCancel(type)} onSave={() => onSave(type, value)}></FilterFooter>

      </div>
    );
  }
}
