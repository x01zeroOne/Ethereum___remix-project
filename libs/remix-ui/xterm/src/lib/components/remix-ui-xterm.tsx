import React, {useState, useEffect, forwardRef} from 'react' // eslint-disable-line
import {ElectronPlugin} from '@remixproject/engine-electron'
import {Xterm} from './xterm-wrap'
import {FitAddon} from './xterm-fit-addOn'

const config = {
  fontSize: 12,
  fontFamily:
    'Menlo, "DejaVu Sans Mono", Consolas, "Lucida Console", monospace',
  fontWeight: 'normal',
  fontWeightBold: 'bold',
  lineHeight: 1,
  letterSpacing: 0,
}

const fitAddon = new FitAddon()

export interface RemixUiXtermProps {
  plugin: ElectronPlugin
  pid: number
  send: (data: string, pid: number) => void
  resize: (event: { cols: number; rows: number }, pid: number) => void
  timeStamp: number
  setTerminalRef: (pid: number, ref: any) => void
  theme: {
    backgroundColor: string
    textColor: string
  }
}

const RemixUiXterm = (props: RemixUiXtermProps) => {
  const {plugin, pid, send, timeStamp, theme, resize} = props
  const xtermRef = React.useRef(null)

  useEffect(() => {
    props.setTerminalRef(pid, xtermRef.current)
  }, [xtermRef.current])

  const onKey = (event: {key: string; domEvent: KeyboardEvent}) => {
    send(event.key, pid)
  }

  const onResize = (event: { cols: number; rows: number }) => {
    resize(event, pid)
  }

  return (
    <Xterm
      addons={[fitAddon]}
      options={{
        theme: {
          background: theme.backgroundColor,
          foreground: theme.textColor,
        },
        fontFamily: config.fontFamily,
        fontSize: config.fontSize,
        letterSpacing: config.letterSpacing,
        lineHeight: config.lineHeight,
      }}
      onResize={onResize}
      onRender={() => fitAddon.fit()}
      ref={xtermRef}
      onKey={onKey}
    ></Xterm>
  )
}

export default RemixUiXterm
