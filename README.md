# A Virtual DOM implementation.

This is a simplistic implementation of the Virtual DOM concept.

## Usage (JSX):
```
import h from 'vdom';

export function TodoList(props) {
    return (
        <ul>
            { 
                props.todos.map((todo, index) => {
                    return (<Todo text={todo.text} completed={!!todo.completed} onToggle={() => props.onToggle(index)}/>)
                }) 
            }
        </ul>
    )
}

export class Todo {
    constructor(props) {
        this.props = props;
    }

    render() {
        return (
            <li classList={this.classList()} onclick={this.props.onToggle}>
                { this.props.text }
            </li>
        )
    }

    classList() {
        return this.props.completed ? ['completed'] : []
    }
}
```

## Usage (no JSX):
```
export function TodoList(props) {
    return {
        type: 'ul',
        children: props.todos.map(todo => {
            return {
                type: Todo,
                props: {
                    text: todo.text,
                    completed: todo.completed
                }
            }
        })
    }
}

export class Todo {
    constructor(props) {
        this.props = props;
    }

    render() {
        return {
            type: 'li',
            classes: this.classList(),
            children: [props.text]
        }
    }

    classList() {
        return this.props.completed ? ['completed'] : []
    }
}
```
