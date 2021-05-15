import { Dimensions } from 'react-native'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export const MAX_HEIGHT = HEIGHT*0.8, MAX_WIDTH = WIDTH*0.8

export const ballProps = {
    x: MAX_HEIGHT/2 - 10,
    y: MAX_WIDTH/2 ,
    velocityX: 5,
    velocityY: 0,
}

export const user1Props = {
    x : 30,
    y : MAX_WIDTH/2 - 50
}

export const user2Props = {
    x : MAX_HEIGHT - 60,
    y : MAX_WIDTH/2 - 50
}

export const user = {
    width:  100,
    height: 30
}