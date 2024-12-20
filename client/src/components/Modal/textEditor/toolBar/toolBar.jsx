import {
    FaBold,
    FaItalic,
    FaUnderline,
    FaStrikethrough,
    FaHighlighter,
    FaList,
    FaUndo,
    FaRedo,
    
  } from 'react-icons/fa';
  import { RiDeleteBin6Line } from "react-icons/ri";
  import { FaListOl } from "react-icons/fa6";
  import toolBar from '../toolBar/toolBar.module.css'
import { Flex } from '@chakra-ui/react';
  const  ToolBar = ({editor}) => {
  return (
    <div className={toolBar.toolbar}>
      <Flex justifyContent={'space-between'}>
        <Flex>    
    <button
      onClick={() => editor.chain().focus().toggleBold().run()}
      title="Bold"
      className={editor.isActive('bold') ? `${toolBar.active}` : ''}
    >
      <FaBold />
    </button>
    <button
      onClick={() => editor.chain().focus().toggleItalic().run()}
      title="Italic"
      className={editor.isActive('italic') ? `${toolBar.active}` : ''}
    >
      <FaItalic />
    </button>
    <button
      onClick={() => editor.chain().focus().toggleUnderline().run()}
      title="Underline"
      className={editor.isActive('underline') ? `${toolBar.active}` : ''}
    >
      <FaUnderline />
    </button>
    <button
      onClick={() => editor.chain().focus().toggleStrike().run()}
      title="Strikethrough"
      className={editor.isActive('strike') ? `${toolBar.active}` : ''}
    >
      <FaStrikethrough />
    </button>
    <button
      onClick={() => editor.chain().focus().toggleHighlight().run()}
      title="Highlight"
      className={editor.isActive('highlight') ? `${toolBar.active}` : ''}
    >
      <FaHighlighter />
    </button>
    <button
      onClick={() => editor.chain().focus().toggleBulletList().run()}
      title="Bullet List"
      className={editor.isActive('bulletList') ? `${toolBar.active}` : ''}
    >
      <FaList />
    </button>
    <button
      onClick={() => editor.chain().focus().toggleOrderedList().run()}
      title="Superscript"
      className={editor.isActive('orderedList') ? `${toolBar.active}` : ''}
    >
     <FaListOl />
    </button>
        </Flex>
        <Flex>
    <button onClick={() => editor.commands.clearContent()} title="Clear Formatting">
      <RiDeleteBin6Line />
    </button>
    <button onClick={() => editor.chain().focus().undo().run()} title="Undo">
      <FaUndo />
    </button>
    <button onClick={() => editor.chain().focus().redo().run()} title="Redo">
      <FaRedo />
    </button>
        </Flex>
      </Flex>
  </div>
  )
}

export default ToolBar