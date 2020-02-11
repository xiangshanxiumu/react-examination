import React, { Component } from 'react';
import classnames from 'classnames';
import styles from './index.css';
import PropTypes from 'prop-types';

class Select extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active: false,
            value:this.props.value || this.props.defaultValue,
        }
    }
    // 下拉展开或收起
    handleActiveClick = () => {
        let { active } = this.state;
        this.setState({
            active: !active
        })
    }
    // option 点击选择
    handleOptionClick = (text) =>{
        let {onChange} = this.props;
        this.setState({
            value:text
        })
        onChange && onChange(text);
    }
    render() {
        let { active,value } = this.state;
        let { placeholder,options,style,noDataTips} = this.props;
        return (
            <div className={styles.selectWrap}
                type="select"
                style={style}
                onClick={this.handleActiveClick.bind(this)}
            >
                <div className={styles.selectBox}>
                    {
                        value ? <div className={styles.selectValue}>{value}</div> :
                            <div className={styles.placeholder}>{placeholder}</div>
                    }
                    <div className={styles.selectArrowBox}>
                        <div className={classnames(styles.selectArrow, active ? styles.active : null)}></div>
                    </div>
                </div>
                {active ?
                    <ul className={styles.select}>
                        {
                            options.length > 0 ?
                            options.map((item, index) => {
                                    return <li
                                    key={index}
                                    value={item.value}
                                    className={classnames(styles.option,item.value===value?styles.optionSelect:null)}
                                    onClick={this.handleOptionClick.bind(this,item.value)}
                                    >{item.value}</li>
                                })
                                :
                            <li className={styles.option}>{noDataTips}</li>
                        }
                    </ul> : null
                }
            </div>
        )
    }
}
Select.propTypes = {
    options:PropTypes.array,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    style:PropTypes.object,
    noDataTips: PropTypes.string,
    allowClear:PropTypes.bool,
}
Select.defaultProps = {
    options:[],
    value: undefined,
    defaultValue: undefined,
    onChange: null,
    placeholder: '请选择',
    style:null,
    noDataTips:'暂无数据',
    allowClear:false,
}
export default Select;