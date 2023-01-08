import { useEffect, useState } from 'react'
import './App.css'
import '../bootstrap.css'
import Board from '../components/Board/Board'
import { DragDropContext } from 'react-beautiful-dnd'
import { v4 as uuidv4 } from 'uuid'
import useLocalStorage from 'use-local-storage'
import { initialBoard } from './initialBoard'

function App() {
  const defaultDark = window.matchMedia('(prefers-colors-scheme: dark)').matches
  const [theme, setTheme] = useLocalStorage(
    'theme',
    defaultDark ? 'dark' : 'light',
  )

  const [boardData, setBoardData] = useState(initialBoard)
  const [taskTitle, setTaskTitle] = useState('')

  const setName = (title, bid) => {
    const index = boardData.findIndex((item) => item.id === bid)
    const tempData = [...boardData]
    tempData[index].boardName = title
    setBoardData(tempData)
  }

  const dragCardInBoard = (source, destination) => {
    let tempData = [...boardData]
    const destinationBoardIdx = boardData.findIndex(
      (item) => item.id.toString() === destination.droppableId,
    )
    const sourceBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === source.droppableId,
    )
    tempData[destinationBoardIdx].card.splice(
      destination.index,
      0,
      tempData[sourceBoardIdx].card[source.index],
    )
    tempData[sourceBoardIdx].card.splice(source.index, 1)

    return tempData
  }

  const removeCard = (boardId, cardId) => {
    const index = boardData.findIndex((item) => item.id === boardId)
    const tempData = [...boardData]
    const cardIndex = boardData[index].card.findIndex(
      (item) => item.id === cardId,
    )

    tempData[index].card.splice(cardIndex, 1)
    setBoardData(tempData)
  }

  const onDragEnd = (result) => {
    const { source, destination } = result
    if (!destination) return

    if (source.droppableId === destination.droppableId) return

    setBoardData(dragCardInBoard(source, destination))
  }

  const updateCard = (bid, cid, card) => {
    const index = boardData.findIndex((item) => item.id === bid)
    if (index < 0) return

    const tempBoards = [...boardData]
    const cards = tempBoards[index].card

    const cardIndex = cards.findIndex((item) => item.id === cid)
    if (cardIndex < 0) return

    tempBoards[index].card[cardIndex] = card
    setBoardData(tempBoards)
  }

  const handleSubmitTask = () => {
    const tempData = [...boardData]
    tempData[0].card.push({
      id: uuidv4(),
      title: taskTitle,
      tags: [],
      task: [],
    })
    // set board data
    setBoardData(tempData)

    // set task title
    setTaskTitle('')
  }
 
  useEffect(() => {
    localStorage.setItem('kanban-assignment-data', JSON.stringify(boardData))
  }, [boardData])

  return (
    <>
      <div className="local__bootstrap">
        <div className="container">
          <div className="d-flex justify-content-center mt-5">
            <div className="col-12 col-lg-6 d-flex">
              <input
                className="form-control"
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                name="taskTitle"
                placeholder="Enter task here"
              />

              <button
                type="button"
                onClick={handleSubmitTask}
                className="btn btn-primary mx-2"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="App" data-theme={theme}>
          {/* create */}
          <div className="app_outer local__bootstrap">
            {/* board */}
            <div className="app_boards  justify-content-center d-block d-lg-flex">
              {boardData.map((item) => (
                <Board
                  key={item.id}
                  id={item.id}
                  name={item.boardName}
                  card={item.card}
                  setName={setName}
                  removeCard={removeCard}
                  updateCard={updateCard}
                />
              ))}
            </div>
          </div>
        </div>
      </DragDropContext>
    </>
  )
}

export default App
