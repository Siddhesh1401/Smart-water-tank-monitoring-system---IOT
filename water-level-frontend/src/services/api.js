const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getLatestWaterLevel() {
  await wait(150)
  return { level: 61 }
}

export async function getMotorStatus() {
  await wait(150)
  return { isOn: false }
}

export async function getReports() {
  await wait(180)
  return [
    { id: 1, date: '2026-03-24', level: 52, motor: 'ON', note: 'Low level trigger' },
    { id: 2, date: '2026-03-25', level: 78, motor: 'OFF', note: 'Tank near full' },
    { id: 3, date: '2026-03-26', level: 61, motor: 'OFF', note: 'Normal range' },
  ]
}
