import React, { Component } from 'react';
import classnames from 'classnames';
import styles from './index.css';
import PropTypes from 'prop-types';

class Pagination extends Component {
    constructor(props) {
        super(props);
        let { total, pageSize, } = props;
        this.state = {
            labels: [],
            currentPage: this.props.currentPage || 1,
            totalPages: Math.ceil(total / pageSize),
            jumpValue:undefined,
        }
    }
    componentWillMount() {
        let newLabels = this.calcLabels(this.props);
        this.setState({
            labels: newLabels,
        })
    }
    componentWillReceiveProps(nextProps) {
        // 比较变化 判断控制刷新
        let newLabels = this.calcLabels(nextProps);
        this.setState({
            labels: newLabels,
        })
    }
    // 计算labels 数据状态
    calcLabels = (props) => {
        let labels = [];
        let { currentPage } = this.state;
        let { previousLabel, nextLabel, total, pageSize } = props;
        //  前一页
        labels.push({
            content: previousLabel,
            value: 'prev',
            show: true,
            type: 'arrow',
        });
        // 中间页码标签 
        let totalPages = Math.ceil(total / pageSize); // 总页数
        for (let i = 0; i < totalPages; i++) {
            labels.push({
                content: i + 1,
                value: i + 1,
                show: false,
                type: 'page',
            })
        }
        // 后一页
        labels.push({
            content: nextLabel,
            value: 'next',
            type: 'arrow',
            show: true,
        });
        // ... 及 << 位置 位于页码 1 后面
        labels.splice(2, 0, {
            content: '•••',
            hover: '<<',
            value: 'leftJump',
            type: 'jump',
            show: false,
            hoverShow: false,
        })
        let len = labels.length;
        // ... 及 >> 位置 位于页码 totalPages-1 后面
        labels.splice(len - 2, 0, {
            content: '•••',
            hover: '>>',
            value: 'rightJump',
            type: 'jump',
            show: false,
            hoverShow: false,
        })
        // labels显示控制
        labels = labels.map(item => {
            if (item.type === 'page') {
                // 最前 最后页码一直显示
                if (item.value === 1 || item.value === totalPages) {
                    item.show = true;
                }
                // 中间部分3个一组显示 <=5时全部显示
                if (totalPages <= 5) {
                    item.show = true;
                } else {
                    // totalPages>5 根据 currentPage当前页码位置控制显示
                    if (currentPage <= 3) {
                        if (item.value <= 4) {
                            item.show = true;
                        }
                    } else if (currentPage === 4) {
                        // currentPage 4
                        if (item.value <= 5) {
                            item.show = true;
                        }
                    } else if (currentPage >= 5) {
                        // 最右侧
                        if (currentPage >= totalPages - 3) {
                            if (item.value >= totalPages - 4) {
                                item.show = true;
                            }
                        } else {
                            // 一般情况
                            if (item.value >= currentPage - 1 && item.value <= currentPage + 1) {
                                item.show = true;
                            }
                        }
                    }
                }
            }
            return item;
        })
        // jump 显示控制 过滤 pages
        let pages = labels.filter(item => {
            return item.type === 'page' && item.show;
        })
        //  通过判断显示的pages组前后是否连续 来控制 jump显示
        labels = labels.map(item => {
            if (pages[1].value - pages[0].value > 1) {
                if (item.value === 'leftJump') {
                    item.show = true;
                }
            }
            let pageslen = pages.length;
            if (pages[pageslen - 1].value - pages[pageslen - 2].value > 1) {
                if (item.value === 'rightJump') {
                    item.show = true;
                }
            }
            return item;
        })
        return labels;
    }
    // 页码点击事件
    handleClick = (value) => {
        let { currentPage } = this.state;
        let { onChange, total, pageSize } = this.props;
        let totalPages = Math.ceil(total / pageSize); // 总页数
        let currentIndex = currentPage;
        switch (value) {
            case 'prev':
                let prevIndex = currentPage;
                if (prevIndex > 1) {
                    prevIndex--;
                }
                currentIndex = prevIndex;
                this.setState({
                    currentPage: prevIndex,
                })
                break;
            case 'next':
                let nextIndex = currentPage;
                if (nextIndex < totalPages) {
                    nextIndex++;
                }
                currentIndex = nextIndex;
                this.setState({
                    currentPage: nextIndex,
                })
                break;
            case 'leftJump':
                let leftIndex = currentPage;
                if (leftIndex > 5) {
                    leftIndex = leftIndex - 5;
                }
                currentIndex = leftIndex;
                this.setState({
                    currentPage: leftIndex,
                })
                break;
            case 'rightJump':
                let rightIndex = currentPage;
                if (rightIndex <= totalPages - 5) {
                    rightIndex = rightIndex + 5;
                }
                currentIndex = rightIndex;
                this.setState({
                    currentPage: rightIndex,
                })
                break;
            default:
                this.setState({
                    currentPage: value
                })
                currentIndex = value;
        }
        onChange && onChange(currentIndex);
    }
    // 左右Jump hover事件
    handleMouseOver = (value) => {
        let { labels } = this.state;
        if (value === 'leftJump' || value === 'rightJump') {
            labels = labels.map((item, index) => {
                if (item.value === value) {
                    item.hoverShow = !item.hoverShow;
                }
                return item;
            })
            this.setState({
                labels: [...labels]
            })
        }
    }
    // 左右Jump out事件
    handleMouseOut = (value) => {
        let { labels } = this.state;
        if (value === 'leftJump' || value === 'rightJump') {
            labels = labels.map((item, index) => {
                if (item.value === value) {
                    item.hoverShow = !item.hoverShow;
                }
                return item;
            })
            this.setState({
                labels: [...labels]
            })
        }
    }
    // 直接输入页码 跳至输入页码
    handleKeyDown = (e) => {
        let { currentPage} = this.state;
        let { onChange, total, pageSize } = this.props;
        let totalPages = Math.ceil(total / pageSize); // 总页数
        let jumpIndex = parseInt(e.target.value);
        let currentIndex = currentPage;
        if (typeof jumpIndex === 'number' && !isNaN(jumpIndex)) {
            if (jumpIndex <= totalPages && jumpIndex !== 0) {
                currentIndex = jumpIndex;
                this.setState({
                    currentPage: jumpIndex,
                    jumpValue:null
                })
                onChange && onChange(currentIndex);
            }
        }
    }
    render() {
        let { labels, currentPage,jumpValue } = this.state;
        return (
            <ul className={styles.paginationWrap}>
                {
                    labels.map((item, index) => {
                        return item.show ? <li className={classnames(styles.label, currentPage === item.value ? styles.labelActive : null)}
                            key={index}
                            value={item.value}
                            onClick={this.handleClick.bind(this, item.value)}
                            onMouseOver={this.handleMouseOver.bind(this, item.value)}
                            onMouseOut={this.handleMouseOut.bind(this, item.value)}
                        >{item.hoverShow ? item.hover : item.content}</li> : null
                    })
                }
                <li className={styles.pageJumper}>
                    跳至
                    <input
                        type="text"
                        value={jumpValue}
                        onKeyDown={this.handleKeyDown.bind(this)}
                    />
                    页
                </li>
            </ul>
        )
    }
}

Pagination.propTypes = {
    pageSize: PropTypes.number, /* 每页显示多少行 */
    currentPage: PropTypes.number, /* 默认选中页 */
    previousLabel: PropTypes.string,  /* 上一页按钮显示文字 */
    nextLabel: PropTypes.string,  /* 下一页显示文字 */
    onChange: PropTypes.func,   /* 触发跳页操作时调用的处理函数 */
    total: PropTypes.number,
}
Pagination.defaultProps = {
    previousLabel: '<',
    nextLabel: '>',
    onChange: null,
    total: 0, // 总数
    pageSize: 5,// 每页数据条数
    currentPage: 1,//当前页码
}
export default Pagination;