import React from 'react'
import { usePicker } from '../context.js'
import { formatInputValues, low, high } from '../utils/formatters.js'
import { controlBtnStyles } from '../styles/styles.js'
import TrashIcon, {
  LinearIcon,
  RadialIcon,
  DegreesIcon,
  StopIcon,
} from './icon.js'

const GradientType = () => {
  const { gradientType, onChange, value, defaultStyles, pickerIdSuffix } =
    usePicker()
  const isLinear = gradientType === 'linear-gradient'
  const isRadial = gradientType === 'radial-gradient'

  const handleLinear = () => {
    const remaining = value.split(/,(.+)/)[1]
    onChange(`linear-gradient(90deg, ${remaining}`)
  }

  const handleRadial = () => {
    const remaining = value.split(/,(.+)/)[1]
    onChange(`radial-gradient(circle, ${remaining}`)
  }

  return (
    <div style={defaultStyles.rbgcpControlBtnWrapper}>
      <div
        onClick={handleLinear}
        id={`rbgcp-linear-btn${pickerIdSuffix}`}
        // className="rbgcp-control-icon-btn rbgcp-linear-btn"
        style={{
          ...defaultStyles.rbgcpControlBtn,
          ...(isLinear && defaultStyles.rbgcpControlBtnSelected),
        }}
        tabIndex={0}
        role="button"
        onKeyDown={() => {
          return
        }}
      >
        <LinearIcon color={isLinear ? '#568CF5' : ''} />
      </div>
      <div
        onClick={handleRadial}
        id={`rbgcp-radial-btn${pickerIdSuffix}`}
        // className="rbgcp-control-icon-btn rbgcp-radial-btn"
        style={{
          ...defaultStyles.rbgcpControlBtn,
          ...(isRadial && defaultStyles.rbgcpControlBtnSelected),
        }}
        tabIndex={0}
        role="button"
        onKeyDown={() => {
          return
        }}
      >
        <RadialIcon color={isRadial ? '#568CF5' : ''} />
      </div>
    </div>
  )
}

const StopPicker = () => {
  const {
    currentLeft,
    currentColor,
    defaultStyles,
    handleGradient,
    pickerIdSuffix,
    stopMin,
    stopMax,
    stopUnit,
  } = usePicker()

  const range = stopMax - stopMin

  // The stop position is stored internally as an integer percent (0-100). The
  // input displays it remapped onto [stopMin, stopMax] and parses typed values
  // back into a percent.
  const displayValue = Math.round(stopMin + (currentLeft / 100) * range)

  const handleMove = (newVal: string) => {
    const clamped = formatInputValues(parseFloat(newVal), stopMin, stopMax)
    const pct = range === 0 ? 0 : ((clamped - stopMin) / range) * 100
    handleGradient(currentColor, pct)
  }

  return (
    <div
      // className="rbgcp-stop-input-wrap"
      style={{
        ...defaultStyles.rbgcpControlBtnWrapper,
        ...defaultStyles.rbgcpControlInputWrap,
        ...defaultStyles.rbgcpStopInputWrap,
        paddingLeft: 8,
      }}
      id={`rbgcp-stop-input-wrapper${pickerIdSuffix}`}
    >
      <StopIcon />
      <input
        value={displayValue}
        id={`rbgcp-stop-input${pickerIdSuffix}`}
        onChange={(e) => handleMove(e.target.value)}
        style={{
          ...defaultStyles.rbgcpControlInput,
          ...defaultStyles.rbgcpStopInput,
          ...(stopUnit ? { paddingLeft: 0, paddingRight: 0 } : {}),
        }}
        // className="rbgcp-control-input rbgcp-stop-input"
      />
      {stopUnit && (
        <span
          style={{
            ...defaultStyles.rbgcpControlInput,
            width: 'auto',
            height: 24,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 0,
            paddingRight: 2,
          }}
        >
          {stopUnit}
        </span>
      )}
    </div>
  )
}

const DegreePicker = () => {
  const { degrees, onChange, value, defaultStyles, pickerIdSuffix } =
    usePicker()

  const handleDegrees = (e: any) => {
    const newValue = formatInputValues(e.target.value, 0, 360)
    const remaining = value.split(/,(.+)/)[1]
    onChange(`linear-gradient(${newValue ?? 0}deg, ${remaining}`)
  }

  return (
    <div
      // className="rbgcp-degree-input-wrap"
      style={{
        ...defaultStyles.rbgcpControlBtnWrapper,
        ...defaultStyles.rbgcpControlInputWrap,
        ...defaultStyles.rbgcpDegreeInputWrap,
      }}
      id={`rbgcp-degree-input-wrapper${pickerIdSuffix}`}
    >
      <DegreesIcon />
      <input
        value={degrees}
        onChange={(e) => handleDegrees(e)}
        id={`rbgcp-degree-input${pickerIdSuffix}`}
        // className="rbgcp-control-input rbgcp-degree-input"
        style={{
          ...defaultStyles.rbgcpControlInput,
          ...defaultStyles.rbgcpDegreeInput,
        }}
      />
      <div
        // className="rbgcp-degree-circle-icon"
        style={{
          ...defaultStyles.rbgcpDegreeIcon,
          position: 'absolute',
          right: degrees > 99 ? 0 : degrees < 10 ? 7 : 3,
          top: 1,
          fontWeight: 400,
          fontSize: 13,
        }}
      >
        °
      </div>
    </div>
  )
}

const DeleteBtn = () => {
  const { colors, selectedColor, createGradientStr, defaultStyles, pickerIdSuffix } =
    usePicker()

  const deletePoint = () => {
    if (colors?.length > 2) {
      const formatted = colors?.map((fc: any, i: number) => ({
        ...fc,
        value: i === selectedColor - 1 ? high(fc) : low(fc),
      }))
      const remaining = formatted?.filter(
        (_: any, i: number) => i !== selectedColor
      )
      createGradientStr(remaining)
    }
  }

  return (
    <div
      onClick={deletePoint}
      style={{ ...controlBtnStyles(false, defaultStyles), width: 28 }}
      id={`rbgcp-point-delete-btn${pickerIdSuffix}`}
      // className="rbgcp-control-btn rbgcp-point-delete-btn"
      tabIndex={0}
      role="button"
      onKeyDown={() => {
        return
      }}
    >
      <TrashIcon />
    </div>
  )
}

const GradientControls = ({
  hideGradientType,
  hideGradientAngle,
  hideGradientStop,
}: {
  hideGradientType?: boolean
  hideGradientAngle?: boolean
  hideGradientStop?: boolean
}) => {
  const { gradientType, defaultStyles, pickerIdSuffix } = usePicker()
  return (
    <div
      style={{
        ...defaultStyles.rbgcpControlBtnWrapper,
        marginTop: 12,
        marginBottom: -4,
        justifyContent: 'space-between',
        paddingLeft: hideGradientType ? 4 : 0,
      }}
      id={`rbgcp-gradient-controls-wrap${pickerIdSuffix}`}
      // className="rbgcp-gradient-controls-wrap"
    >
      {!hideGradientType && <GradientType />}
      <div style={{ width: 53 }}>
        {!hideGradientAngle && gradientType === 'linear-gradient' && (
          <DegreePicker />
        )}
      </div>
      {!hideGradientStop && <StopPicker />}
      <DeleteBtn />
    </div>
  )
}

export default GradientControls
