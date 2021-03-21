import React, { useCallback, useState } from 'react';
import { Button, Error, Form, Header, Input, Label, LinkContainer, Success } from '@pages/Signup/styles'
import useInput from '@hooks/useInput'
const Signup = () => {

  const [ email, onChangeEmail ] = useInput('')
  const [nickname, onChangeNickname] = useInput('');
  const [password, _1, setPassword] = useInput('');
  const [passwordCheck, _2, setPasswordCheck] = useInput('');

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value)
  },[])

  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value)
  },[])

  const onSubmit = useCallback((e) => {
    e.preventDefault()
    console.log({
      email,
      password,
      nickname,
      passwordCheck
    })
  },[email,
    password,
    nickname,
    passwordCheck])
  
  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <a href="/login">로그인 하러가기</a>
      </LinkContainer>
    </div>
  )
}

export default Signup
