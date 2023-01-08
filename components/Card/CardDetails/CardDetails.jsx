import React, { useState, useEffect } from 'react'
import { Trash } from 'react-feather'
import Modal from '../../Modal/Modal'
import './CardDetails.css'

export default function CardDetails(props) {
  const colors = ["#61bd4f", "#f2d600", "#ff9f1a", "#eb5a46", "#c377e0"];

  const [values, setValues] = useState({ ...props.card });
  const [input, setInput] = useState(false);
  const [text, setText] = useState(values.title);
  const [labelShow, setLabelShow] = useState(false);
  const Input = (props) => {
    return (
      <div className="">
        <input
          autoFocus
          defaultValue={text}
          type={'text'}
          onChange={(e) => {
            setText(e.target.value)
          }}
        />
      </div>
    )
  }
  const addTask = (value) => {
    values.task.push({
      id: uuidv4(),
      task: value,
      completed: false,
    });
    setValues({ ...values });
  };

  const removeTask = (id) => {
    const remaningTask = values.task.filter((item) => item.id !== id);
    setValues({ ...values, task: remaningTask });
  };

  const deleteAllTask = () => {
    setValues({
      ...values,
      task: [],
    });
  };

  const updateTask = (id) => {
    const taskIndex = values.task.findIndex((item) => item.id === id);
    values.task[taskIndex].completed = !values.task[taskIndex].completed;
    setValues({ ...values });
  };
  const updateTitle = (value) => {
    setValues({ ...values, title: value })
  }

  const calculatePercent = () => {
    const totalTask = values.task.length;
    const completedTask = values.task.filter(
      (item) => item.completed === true
    ).length;

    return Math.floor((completedTask * 100) / totalTask) || 0;
  };

  const removeTag = (id) => {
    const tempTag = values.tags.filter((item) => item.id !== id);
    setValues({
      ...values,
      tags: tempTag,
    });
  };

  const addTag = (value, color) => {
    values.tags.push({
      id: uuidv4(),
      tagName: value,
      color: color,
    });

    setValues({ ...values });
  };
  const handelClickListner = (e) => {
    if (e.code === 'Enter') {
      setInput(false)
      updateTitle(text === '' ? values.title : text)
    } else return
  }
  const updateCardTitle = (value) => {
    setInput(false)
    updateTitle(text === '' ? values.title : text)
  }

  useEffect(() => {
    document.addEventListener('keypress', handelClickListner)
    return () => {
      document.removeEventListener('keypress', handelClickListner)
    }
  })
  useEffect(() => {
    if (props.updateCard) props.updateCard(props.bid, values.id, values)
  }, [values])

  return (
    <Modal onClose={props.onClose}>
      <div className="local__bootstrap">
        <div
          className="container"
          style={{ minWidth: '550px', position: 'relative' }}
        >
          <div className="row p-5">
            <div className="d-flex  card__action__btn flex-column gap-2">
              {input ? (
                <>
                  <Input title={values.title} />
                  <button onClick={(e) => updateCardTitle(values.title)}>
                    <span className="icon__sm">
                      <Trash />
                    </span>
                    Update Card
                  </button>
                </>
              ) : (
                <>
                  <h5
                    style={{ cursor: 'pointer' }}
                    onClick={() => setInput(true)}
                  >
                    {values.title}
                  </h5>
                  <button
                    onClick={() => {
                      setInput(true)
                    }}
                  >
                    <span className="icon__sm">
                      <Trash />
                    </span>
                    Update Card
                  </button>
                </>
              )}

              <button onClick={() => props.removeCard(props.bid, values.id)}>
                <span className="icon__sm">
                  <Trash />
                </span>
                Delete Card
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
