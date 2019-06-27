import React, { Component } from 'react';
import { signup, /*checkUsernameAvailability,*/ checkEmailAvailability } from '../../util/APIUtils';
import './Signup.css';
import { Link } from 'react-router-dom';
import Recaptcha from 'react-recaptcha';
import {
    SURNAME_MAX_LENGTH, SURNAME_MIN_LENGTH, NAME_MIN_LENGTH, NAME_MAX_LENGTH,
    MIDDLE_NAME_MIN_LENGTH, MIDDLE_NAME_MAX_LENGTH,
    EMAIL_MAX_LENGTH,
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH
} from '../../constants';

import { Form, Input, Button, notification } from 'antd';
const FormItem = Form.Item;

class Signup extends Component {
    constructor(props) {
        super(props);
        this.verifyCallback = this.verifyCallback.bind(this);
        this.state = {
            name: {
                value: ''
            },
            surname: {
                value: ''
            },
            middle_name: {
                value: ''
            },
            email: {
                value: ''
            },
            password: {
                value: ''
            },
            confirm_password:{
                value:''
            },

            isVerified: false


        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.validateUsernameAvailability = this.validateUsernameAvailability.bind(this);
        this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }


    verifyCallback(response) {
        if (response) {
            this.setState({
                isVerified: true
            })
        }
    }
    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;
        if(inputName==="password"){
            this.setState({confirm_password:
                {value : ""}})
        }
        this.setState({
            [inputName] : {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    }

    handleInputConfirmChange(event, event2, validationFun){
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;
        const originInputValue = event2;

        this.setState({
            [inputName] : {
                value: inputValue,
                ...validationFun(inputValue,originInputValue)
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const signupRequest = {
            surname: this.state.surname.value,
            name: this.state.name.value,
            email: this.state.email.value,
            middle_name: this.state.middle_name.value,
            password: this.state.password.value,
            confirm_password: this.state.confirm_password.value
        };
        signup(signupRequest)
        .then(response => {
            notification.success({
                message: 'Личный кабинет',
                description: "Спасибо! Вы успешно зарегистрировались. Пожалуйста войдите чтобы продолжить!",
            });
            this.props.history.push("/login");
        }).catch(error => {
            notification.error({
                message: 'Личный кабинет',
                description: error.message || 'Извините! Что-то пошло не так. Попробуйте еще раз!'
            });
        });
    }

    isFormInvalid() {
        return !(this.state.name.validateStatus === 'success' &&
            this.state.surname.validateStatus === 'success' &&
            this.state.middle_name.validateStatus === 'success' &&
            this.state.email.validateStatus === 'success' &&
            this.state.password.validateStatus === 'success' &&
            this.state.confirm_password.validateStatus === 'success' &&
            this.state.isVerified === true
        );
    }

    render() {
        return (
            <div className="signup-container">
                <h1 className="page-title">Регистрация</h1>
                <div className="signup-content">
                    <Form onSubmit={this.handleSubmit} className="signup-form">
                        <FormItem
                            label="Фамилия"
                            validateStatus={this.state.surname.validateStatus}
                            help={this.state.surname.errorMsg}>
                            <Input
                                size="large"
                                name="surname"
                                autoComplete="off"
                                placeholder="Ваша фамилия"
                                value={this.state.surname.value}
                                onChange={(event) => this.handleInputChange(event, this.validateSurname)} />
                        </FormItem>
                        <FormItem
                            label="Имя"
                            validateStatus={this.state.name.validateStatus}
                            help={this.state.name.errorMsg}>
                            <Input
                                size="large"
                                name="name"
                                autoComplete="off"
                                placeholder="Ваше имя"
                                value={this.state.name.value}
                                onChange={(event) => this.handleInputChange(event, this.validateName)} />
                        </FormItem>
                        <FormItem label="Отчество"
                            hasFeedback
                            validateStatus={this.state.middle_name.validateStatus}
                            help={this.state.middle_name.errorMsg}>
                            <Input
                                size="large"
                                name="middle_name"
                                autoComplete="off"
                                placeholder="Ваше отчество"
                                value={this.state.middle_name.value}
                                // onBlur={this.validateUsernameAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateMiddle_name)} />
                        </FormItem>
                        <FormItem
                            label="Почта"
                            hasFeedback
                            validateStatus={this.state.email.validateStatus}
                            help={this.state.email.errorMsg}>
                            <Input
                                size="large"
                                name="email"
                                type="email"
                                autoComplete="off"
                                placeholder="Ваша почта"
                                value={this.state.email.value}
                                onBlur={this.validateEmailAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateEmail)} />
                        </FormItem>
                        <FormItem
                            label="Пароль"
                            validateStatus={this.state.password.validateStatus}
                            help={this.state.password.errorMsg}>
                            <Input
                                size="large"
                                name="password"
                                type="password"
                                autoComplete="off"
                                placeholder="Пароль долженбыть от 6 до 20 символов"
                                value={this.state.password.value}
                                onChange={(event) => {this.handleInputChange(event, this.validatePassword)} } />
                        </FormItem>
                        <FormItem
                            label="Подтвердите пароль"
                            validateStatus={this.state.confirm_password.validateStatus}
                            help={this.state.confirm_password.errorMsg}>
                            <Input
                                size="large"
                                name="confirm_password"
                                type="password"
                                autoComplete="off"
                                ref={el => this.inputTitle = el}
                                placeholder="Введите пароль для подтвержденя"
                                value={this.state.confirm_password.value}
                                onChange={(event, event2) => this.handleInputConfirmChange(event, this.state.password.value, this.validateConfirm_Password)} />
                        </FormItem>
                         <FormItem>
                            <Recaptcha
                            sitekey="6LcSlaoUAAAAAHyL_zL4Jv6bsW0A90vraWe-j_ct"
                             render="explicit"
                             verifyCallback={this.verifyCallback} />
                          </FormItem>

                        <FormItem>
                            <Button type="primary"
                                htmlType="submit"
                                size="large"
                                className="signup-form-button"
                                disabled={this.isFormInvalid()}>Регистрация</Button>
                            Уже зарегистрированы? <Link to="/login">Войти сейчас!</Link>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }

    // Validation Functions

    validateName = (name) => {
        const Name_REGEX = RegExp('[А-яА-яё]');
        if(!Name_REGEX.test(name)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Name not valid'
            }
        }
        else if (name.length < NAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Имя слишком короткое (Минимум ${NAME_MIN_LENGTH} букв.)`
            }
        } else if (name.length > NAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Имя слишком длинное (Максимум ${NAME_MAX_LENGTH} букв.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
              };
        }
    }

    validateSurname = (surname) => {
        if(surname.length < SURNAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Фамилия слишком короткая (Минимум ${SURNAME_MIN_LENGTH} букв.)`
            }
        } else if (surname.length > SURNAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Фамилия слишком длинная (Максимум ${SURNAME_MAX_LENGTH} букв.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
              };
        }
    }


    validateEmail = (email) => {
        if(!email) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email may not be empty'
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if(!EMAIL_REGEX.test(email)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email not valid'
            }
        }

        if(email.length > EMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`
            }
        }

        return {
            validateStatus: null,
            errorMsg: null
        }
    }

    validateMiddle_name = (middle_name) => {
        if(middle_name.length < MIDDLE_NAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Отчество слишком короткое (Минимум ${MIDDLE_NAME_MIN_LENGTH} букв.)`
            }
        } else if (middle_name.length > MIDDLE_NAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Отчество слишком длинное (Максимум ${MIDDLE_NAME_MAX_LENGTH} букв.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    // validateUsernameAvailability() {
    //     // First check for client side errors in username
    //     const usernameValue = this.state.middle_name.value;
    //     const usernameValidation = this.validateMiddle_name(usernameValue);

    //     if(usernameValidation.validateStatus === 'error') {
    //         this.setState({
    //             username: {
    //                 value: usernameValue,
    //                 ...usernameValidation
    //             }
    //         });
    //         return;
    //     }

    //     this.setState({
    //         username: {
    //             value: usernameValue,
    //             validateStatus: 'validating',
    //             errorMsg: null
    //         }
    //     });

    //     checkUsernameAvailability(usernameValue)
    //     .then(response => {
    //         if(response.available) {
    //             this.setState({
    //                 username: {
    //                     value: usernameValue,
    //                     validateStatus: 'success',
    //                     errorMsg: null
    //                 }
    //             });
    //         } else {
    //             this.setState({
    //                 username: {
    //                     value: usernameValue,
    //                     validateStatus: 'error',
    //                     errorMsg: 'This username is already taken'
    //                 }
    //             });
    //         }
    //     }).catch(error => {
    //         // Marking validateStatus as success, Form will be recchecked at server
    //         this.setState({
    //             username: {
    //                 value: usernameValue,
    //                 validateStatus: 'success',
    //                 errorMsg: null
    //             }
    //         });
    //     });
    // }

    validateEmailAvailability() {
        // First check for client side errors in email
        const emailValue = this.state.email.value;
        const emailValidation = this.validateEmail(emailValue);

        if(emailValidation.validateStatus === 'error') {
            this.setState({
                email: {
                    value: emailValue,
                    ...emailValidation
                }
            });
            return;
        }

        this.setState({
            email: {
                value: emailValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkEmailAvailability(emailValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    email: {
                        value: emailValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    email: {
                        value: emailValue,
                        validateStatus: 'error',
                        errorMsg: 'This Email is already registered'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                email: {
                    value: emailValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validatePassword = (password) => {
        if(password.length < PASSWORD_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`
            }
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }

    }

    validateConfirm_Password = (confirm_password,password)=>{

        if(confirm_password !== password) {
            return {
                validateStatus: 'error',
                errorMsg: `Пароль не совпадает.`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }

}

export default Signup;