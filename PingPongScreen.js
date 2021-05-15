import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Audio }  from 'expo-av'
import { ballProps, user1Props, user2Props, user, MAX_HEIGHT, MAX_WIDTH} from './components/Props'
import Ball from './components/ball'
import User1 from './components/user1'
import User2 from './components/user2'

const initial = {
  speed: 7,

  ball: [ballProps.x, ballProps.y],
  velocityX : 0,
  velocityY : 0,

  user1: [user1Props.x, user1Props.y],
  score1: 0,

  user2: [user2Props.x, user2Props.y],
  score2: 0,
  
  direction: 'choose',
  playWith: 'null',
  level: 0.1
}

export default class PingPongScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = initial
  }

  componentDidMount() {
    setInterval(() => {
      this.update()
      this.hitWall()
    }, 1000/50)
  }

  componentDidUpdate() {
    this.checkStatus()
  }


  async playSoundComScore() {
    const { sound } = await Audio.Sound.createAsync(
      require('./audio/comScore.mp3')
    )
    await sound.playAsync()
  }

  async playSoundUserScore() {
    const { sound } = await Audio.Sound.createAsync(
      require('./audio/userScore.mp3')
    )
    await sound.playAsync()
  }

  async playSoundHit() {
    const { sound } = await Audio.Sound.createAsync(
      require('./audio/hit.mp3')
    )
    await sound.playAsync()
  }

  async playSoundWall() {
    const { sound } = await Audio.Sound.createAsync(
      require('./audio/wall.mp3')
    )
    await sound.playAsync()
  }


  resetBall = () => {
    this.setState({
      speed: 7,
      ball: [ballProps.x, ballProps.y],
      velocityX: -this.state.velocityX
    })
  }

  moveUser1 = (direction) => {
    const { user1 } = this.state
    let gap

    if(direction == 'left') {
      if(user1[1] < MAX_WIDTH - user.width)
        gap = 30
      else 
        gap = 0
    } else {
      if(user1[1] > 0)
        gap = -30
      else 
        gap = 0
    }
    let newUser = [user1[0], user1[1] + gap]
    this.setState({ user1: newUser})
  }

  moveUser2 = (direction) => {
    const { user2 } = this.state
    let gap

    if(direction == 'left') {
      if(user2[1]< MAX_WIDTH - user.width)
        gap = 30
      else 
        gap = 0
    } else {
      if(user2[1] > 0)
        gap = -30
      else 
        gap = 0
    }
    let newUser = [user2[0], user2[1] + gap]
    this.setState({ user2: newUser})
  }

  collision = (b,p) =>  {
    let pTop = p[1]
    let pBottom = p[1] + user.width
    let pLeft = p[0]
    let pRight = p[0] + user.height
    
    let bTop = b[1]
    let bBottom = b[1] + 20
    let bLeft = b[0]
    let bRight = b[0] + 20
    
    return pLeft < bRight && pTop < bBottom && pRight > bLeft && pBottom > bTop
  }

  checkStatus = () => {
    const { ball, score1, score2 } = this.state
    //check out of game area
    if(ball[0] < -5) {
      this.setState({ score2: score2 + 1})
      //play sound score2
      this.playSoundUserScore()
      this.resetBall()
    } else if(ball[0] > MAX_HEIGHT) {
      this.setState({ score1: score1 + 1})
      //play sound score 1
      this.playSoundComScore()
      this.resetBall()
    }
  }

  // when the ball collides with bottom and top walls we inverse the velocityY.
  hitWall = () => {
    const { ball } = this.state
    if(ball[1] < 0 || ball[1] > MAX_WIDTH-20) {
      this.setState({ velocityY: -this.state.velocityY})
      this.playSoundWall()
    }
  }

  update = () => {
    const { ball, user1, user2, speed, velocityX, velocityY, playWith, level } = this.state
  
    //start ball
    let newBall = [ball[0] + velocityX, ball[1] + velocityY]
    this.setState({ ball: newBall })

    //simple AI
    if(playWith != 'player') {
      let bot = [user1[0], user1[1] + ((ball[1]- ( user1[1] + user.width/2))) * level] 
      this.setState({ user1: bot })
    }

    //check player
    let player = (ball[0] + 10 < MAX_HEIGHT/2) ? user1 : user2

    // if the ball hits a paddle
    if(this.collision(ball, player)) {
      //play sound hit
      this.playSoundHit()
      //check where the ball hit is
      let collidePoint = (ball[1]+10) - (player[1] + 50)

      collidePoint = collidePoint / (user.width/2)

      let angleRad = (Math.PI/4) * collidePoint

      // change the X and Y velocity direction
      let direction = (ball[0] + 10 < MAX_HEIGHT/2) ? 1 : -1
      this.setState({
        velocityX: direction * Math.cos(angleRad) * speed,
        velocityY: Math.sin(angleRad) * speed,
        speed: speed+0.1
      })
    }
  }

  handleChoose = (e) => {
    switch(e) {
      case 'player': 
        this.setState({
          speed: 7,
          ball: [ballProps.x, ballProps.y],
          velocityX : ballProps.velocityX,
          velocityY : ballProps.velocityY,
          direction: 'play',
          playWith: 'player'
        })
        break
      case 'hard':
        this.setState({
          speed: 7,
          ball: [ballProps.x, ballProps.y],
          velocityX : ballProps.velocityX,
          velocityY : ballProps.velocityY,
          direction: 'play',
          playWith: 'bot',
          level: 1,
        })
        break
      case 'medium':
        this.setState({
          speed: 7,
          ball: [ballProps.x, ballProps.y],
          velocityX : ballProps.velocityX,
          velocityY : ballProps.velocityY,        
          direction: 'play',
          playWith: 'bot',
          level: 0.5,
        })
        break
      case 'easy':
        this.setState({
          speed: 7,
          ball: [ballProps.x, ballProps.y],
          velocityX : ballProps.velocityX,
          velocityY : ballProps.velocityY,        
          direction: 'play',
          playWith: 'bot',
          level: 0.1,
        })
        break
      case 'go-back':
        this.setState(initial)
        break
      default:
        break
    }
  }

  render() {
    const { ball, user1, user2, score1, score2, playWith, direction } = this.state
    let nets = [0, 50, 100, 150, 200, 250, 300]
    if(direction == 'play') {
      return (
        <>
        <View style={styles.container}>
          {playWith == "player" && (
            <View style={styles.containButton}>
              <Text onPress={() => this.moveUser1('left')} style={styles.button}>{'<'}</Text>
              <Text onPress={() => this.moveUser1('right')} style={styles.button}>{'>'}</Text>
            </View>
          )}

          <View style={styles.gameArea}>
            <Ball size={20} ball={ball}/>
  
            <User1 
              width={user.width} 
              height={user.height}
              user1={user1}
            />
  
            <View style={styles.pointArea1}>
              <Text style={styles.score}>{score1}</Text>
            </View>
  
            {nets.map((right, i) => {
              return <View style={{
                position: 'absolute',
                width: 20,
                height: 2,
                backgroundColor: '#fff',
                top: MAX_HEIGHT/2 - 1,
                right: right
              }}
                key={i}
              />
            })}
  
            <User2
              width={user.width} 
              height={user.height}
              user2={user2}
            />
  
            <View style={styles.pointArea2}>
              <Text style={styles.score}>{score2}</Text>
            </View>
  
          </View>
  
          <View style={styles.containButton}>
            <Text onPress={() => this.moveUser2('left')} style={styles.button}>{'<'}</Text>
            <Text onPress={() => this.moveUser2('right')} style={styles.button}>{'>'}</Text>
          </View>
        </View>
        <View style={{ backgroundColor: '#bbb'}}>
          <Text style={styles.smallButton} onPress={() => this.handleChoose('go-back')}>GO BACK</Text>
        </View>
        </>
      )
    } else {
      return (
        <View style={styles.containMenu}>
          {direction == 'choose' && (
            <View style={styles.menu}>
              <Text style={styles.choice} onPress={() => this.setState({ direction: 'choose-bot' })}>BOT</Text>
              <Text style={styles.choice} onPress={() => this.handleChoose('player')}>2 PLAYER</Text>
            </View>
          )}

          {direction == 'choose-bot' && (
            <View style={styles.menu}>
              <Text style={styles.choice1} onPress={() => this.handleChoose('hard')}>HARD</Text>
              <Text style={styles.choice1} onPress={() => this.handleChoose('medium')}>MEDIUM</Text>
              <Text style={styles.choice1} onPress={() => this.handleChoose('easy')}>HARD</Text>
              <Text style={styles.smallButton} onPress={() => this.setState({ direction: 'choose' })}>GO BACK</Text>
            </View>
          )}
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bbb'
  },
  gameArea: {
    width: MAX_WIDTH,
    height: MAX_HEIGHT,
    position: 'relative',
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#fff'
  },
  containButton: {
    flexDirection: 'row'
  },
  button: {
    paddingHorizontal: 32,
    fontSize: 35,
    color: '#fff'
  },
  pointArea1: {
    position: 'absolute',
    right: MAX_WIDTH/5, 
    top: MAX_HEIGHT*1/7
  },
  pointArea2: {
    position: 'absolute',
    right: MAX_WIDTH/5, 
    top: MAX_HEIGHT*0.8
  },
  score: {
    fontSize: 35,
    color: '#fff',
    fontWeight: 'bold'
  },
  containMenu: {
    position: 'absolute', 
    top: MAX_HEIGHT/2 - 125, 
    left: MAX_WIDTH/2 - 80
  },
  menu: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: 250,
    height: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0},
    shadowOpacity: 0.7,
    opacity: null
  },
  choice: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    margin: 8,
    backgroundColor: '#000',
    color: '#ddd',
    alignSelf: 'center',
    top: 50
  },
  choice1: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    margin: 8,
    backgroundColor: '#000',
    color: '#ddd',
    alignSelf: 'center'
  },
  smallButton: {
    fontSize: 15,
    fontWeight: 'bold',
    backgroundColor: '#000',
    color: '#ddd',
    alignSelf: 'flex-start'
  }
})