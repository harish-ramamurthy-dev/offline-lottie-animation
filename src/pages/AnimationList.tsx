import {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Col,
  Layout,
  Row,
  Typography,
  Input,
  Pagination,
  Skeleton,
} from "antd";
import { PublicAnimation } from "../common/interfaces/PublicAnimation.interface";
import AnimationCard from "../components/AnimationCard";
import { SearchOutlined } from "@ant-design/icons";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  selectPublicAnimations,
  getPublicAnimations,
  selectTotalCount,
  selectPageInfo,
  searchPublicAnimations,
  selectFilteredPublicAnimations,
  updateFilteredPublicAnimations,
  updateTotalCount,
  updatePublicAnimations,
} from "../store/animationReducer";
import debounce from "lodash.debounce";
import useNetworkState from "../common/hooks/useNetworkState";
import { removeArrayDuplicatesByProp } from "../common/utils";
import { Content, Footer } from "antd/es/layout/layout";

const { Title } = Typography;
const { Header } = Layout;

const AnimationList: FC = () => {
  const PAGE_SIZE = 12;
  const isOnline = useNetworkState();
  const publicAnimations = useAppSelector(selectPublicAnimations);
  const filteredPublicAnimations = useAppSelector(
    selectFilteredPublicAnimations
  );
  const totalCount = useAppSelector(selectTotalCount);
  const pageInfo = useAppSelector(selectPageInfo);
  const dispatch = useAppDispatch();
  const [input, setInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const storageAnimations = removeArrayDuplicatesByProp(
    [...publicAnimations, ...filteredPublicAnimations],
    "id"
  );

  const debouncedSearch = useCallback(
    debounce(
      (value: string) =>
        dispatch(searchPublicAnimations({ query: value, first: PAGE_SIZE })),
      500
    ),
    [dispatch]
  );

  useEffect(() => {
    dispatch(getPublicAnimations({ first: PAGE_SIZE }));
    const handleMessageFromServiceWorker = (event: any) => {
      if (event.data.type === "UPDATE_REDUX_STORE") {
        dispatch(updatePublicAnimations(event.data.payload));
      }
    };
    window.addEventListener("message", handleMessageFromServiceWorker);
    return () => {
      window.removeEventListener("message", handleMessageFromServiceWorker);
    };
  }, [dispatch]);

  const onInputChange = useCallback(
    (
      event: ChangeEvent<HTMLInputElement> | KeyboardEvent<HTMLInputElement>
    ) => {
      event.persist();
      const { value } = event.target as HTMLInputElement;
      setInput(value);
      if (isOnline) {
        value
          ? debouncedSearch(value)
          : dispatch(updateFilteredPublicAnimations([]));
      } else {
        const filteredAnimations = storageAnimations.filter(({ name }) =>
          name.includes(value)
        );
        dispatch(updateFilteredPublicAnimations(filteredAnimations));
        dispatch(updateTotalCount(filteredAnimations.length));
        if (value) {
          debouncedSearch(value);
        }
      }
      setPage(1);
    },
    [debouncedSearch, dispatch, isOnline, storageAnimations]
  );

  const onPageChange = (newPage: number) => {
    if (page < newPage) {
      const nextInput = {
        after: pageInfo?.endCursor ?? null,
        first: PAGE_SIZE,
      };
      if (filteredPublicAnimations.length) {
        dispatch(searchPublicAnimations({ ...nextInput, query: input }));
      } else {
        dispatch(getPublicAnimations(nextInput));
      }
    } else {
      const prevInput = {
        before: pageInfo?.startCursor ?? null,
        last: PAGE_SIZE,
      };
      if (filteredPublicAnimations.length) {
        dispatch(searchPublicAnimations({ ...prevInput, query: input }));
      } else {
        dispatch(getPublicAnimations(prevInput));
      }
    }
    setPage(newPage);
  };

  if (!filteredPublicAnimations.length && !publicAnimations.length) {
    return <Skeleton active />;
  }

  return (
    <Layout style={{ height: "100%" }}>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <Title
          level={4}
          style={{ color: "white", textAlign: "center", margin: 0 }}
        >
          The world’s largest library of free animations
        </Title>
        <Input
          allowClear
          placeholder="Search Animations"
          prefix={<SearchOutlined />}
          style={{ width: 220 }}
          value={input}
          onChange={onInputChange}
          onPressEnter={onInputChange}
        />
      </Header>
      <Content style={{ flexGrow: 1, overflowY: "auto" }}>
        <Row gutter={[16, 16]}>
          {(filteredPublicAnimations.length
            ? filteredPublicAnimations
            : publicAnimations
          )
            .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
            .map((publicAnimation: PublicAnimation) => {
              return (
                <Col
                  xs={24}
                  sm={12}
                  md={8}
                  lg={8}
                  xl={6}
                  key={publicAnimation.id}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <AnimationCard publicAnimation={publicAnimation} />
                </Col>
              );
            })}
        </Row>
      </Content>
      <Footer style={{ height: "64px" }}>
        <Row style={{ justifyContent: "center" }}>
          <Col>
            <Pagination
              simple
              hideOnSinglePage={true}
              current={page}
              pageSize={PAGE_SIZE}
              total={totalCount}
              onChange={onPageChange}
            />
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};

export default AnimationList;
