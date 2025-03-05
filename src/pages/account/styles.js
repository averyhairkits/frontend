import { Button } from 'common/components/Button';
import styled from 'styled-components';
import logo from '../../assets/icons/logosfinals/logotransparentbg.png';

export const StyledPage = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;


//********LEFTSIDE COMPONENTS********************************************************************************//

export const LeftSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--darkpurple);
  height: 100vh;
  width: 500px;

  .Logo {
    background-image: url(${logo});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    filter: brightness(0) invert(1);
    height: 40vh;
    width: 100%;
    gap: 20px;
    margin-bottom: 30px;
  
  }

  .BigText {
    font-size: 2rem;
    font-weight: bold;
    text-align: center;
    color: white;
    margin: 20px;
    max-width: 65%;
    font-family: 'Inter', sans-serif;
}
`;

//********RIGHTSIDE COMPONENTS********************************************************************************//
export const RightSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  height: 100vh;
  font-family: 'Inter', sans-serif;
`;

export const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 100px;
  width: 100%;
`;

export const ToggleTab = styled.div`
  padding: 10px 20px;
  font-size: 1.5rem;
  font-weight: ${({ active }) => (active ? "bold" : "regular")}; /* Bold when active */
  color: ${({ active }) => (active ? "#4B0082" : "#aaa")}; /* Purple when active */
  border-bottom: ${({ active }) => (active ? "3px solid #4B0082" : "none")};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: #4B0082;
  }
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 25%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
`;

export const StyledInput = styled.input`
  font-size: 1rem;
  padding: 8px;
  border-radius: 1px;
  width: 375px;
`;

export const PasswordContainer = styled.div`
  position: relative;
  width: fit-content;
`;

export const IconContainer = styled.div`
  position: absolute;
  right: 10px;
  top: 8px;
  background-color: var(--white);
  cursor: pointer;
`;

export const StyledButton = styled(Button.Primary)`
  font-size: 1.1rem;
  width: content;
  padding-left: 30px;
  padding-right: 30px;
  margin-left: auto;
  margin-right: auto;
`;